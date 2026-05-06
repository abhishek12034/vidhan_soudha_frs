query = [
    {
        "$match": {
            "metaFaceEvent.captureTime": {
                "$gte": 1754850600000,
                "$lt": 1754937000000,
            },
            "metaFaceEvent.confidence": {"$gte": 80},
            "metaFaceEvent.registeredFaceId": {"$ne": None},
            "eventDetails.cameraName": {"$regex": "(entry|exit)", "$options": "i"},
        }
    },
    {
        "$addFields": {
            "eventType": {
                "$cond": [
                    {
                        "$regexMatch": {
                            "input": "$eventDetails.cameraName",
                            "regex": "(?i)entry",
                        }
                    },
                    0,  # Entry
                    1,  # Exit
                ]
            },
            "timeInSeconds": {
                "$toLong": {"$divide": ["$metaFaceEvent.captureTime", 1000]}
            },
        }
    },
    {"$sort": {"metaFaceEvent.registeredFaceId": 1, "timeInSeconds": 1}},
    {
        "$group": {
            "_id": "$metaFaceEvent.registeredFaceId",
            "fullName": {"$first": "$metaFaceEvent.fullName"},
            "events": {"$push": {"type": "$eventType", "time_stamp": "$timeInSeconds"}},
            "entryCount": {"$sum": {"$cond": [{"$eq": ["$eventType", 0]}, 1, 0]}},
            "exitCount": {"$sum": {"$cond": [{"$eq": ["$eventType", 1]}, 1, 0]}},
        }
    },
    {
        "$addFields": {
            "totalTimeInRoomSeconds": {
                "$function": {
                    "body": """
                    function(events) {
                        let total = 0;
                        for (let i = 0; i < events.length - 1; i++) {
                            if (events[i].type === 0) {
                                for (let j = i + 1; j < events.length; j++) {
                                    if (events[j].type === 1) {
                                        total += events[j].time_stamp - events[i].time_stamp;
                                        i = j;
                                        break;
                                    }
                                }
                            }
                        }
                        return total;
                    }
                    """,
                    "args": ["$events"],
                    "lang": "js",
                }
            }
        }
    },
    {
        "$addFields": {
            "hours": {"$floor": {"$divide": ["$totalTimeInRoomSeconds", 3600]}},
            "minutes": {
                "$floor": {"$divide": [{"$mod": ["$totalTimeInRoomSeconds", 3600]}, 60]}
            },
            "seconds": {"$mod": ["$totalTimeInRoomSeconds", 60]},
        }
    },
    {
        "$addFields": {
            "totalTimeInRoomFormatted": {
                "$concat": [
                    {"$cond": [{"$lt": ["$hours", 10]}, "0", ""]},
                    {"$toString": "$hours"},
                    ":",
                    {"$cond": [{"$lt": ["$minutes", 10]}, "0", ""]},
                    {"$toString": "$minutes"},
                    ":",
                    {"$cond": [{"$lt": ["$seconds", 10]}, "0", ""]},
                    {"$toString": "$seconds"},
                ]
            }
        }
    },
    {
        "$project": {
            "_id": 0,
            "registeredFaceId": "$_id",
            "fullName": 1,
            "entryCount": 1,
            "exitCount": 1,
            "totalTimeInRoomSeconds": 1,
            "totalTimeInRoomFormatted": 1,
        }
    },
]


class ReportRepository:
    def __init__(self, db):
        self.db = db

    async def get_report_data(self, start_time_epoc, end_time_epoc):
        query[0]["$match"]["metaFaceEvent.captureTime"]["$gte"] = start_time_epoc
        query[0]["$match"]["metaFaceEvent.captureTime"]["$lt"] = end_time_epoc
        attendence_cursor = self.db["faceEvents"].aggregate(query)
        attendence = await attendence_cursor.to_list(length=None)
        return attendence
