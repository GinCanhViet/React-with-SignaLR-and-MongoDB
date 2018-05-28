using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealTimeUsingSignalR.Entities
{
    public class Message
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("username")]
        public string Username { get; set; }

        [BsonElement("message")]
        public string MessageContent { get; set; }

        [BsonElement("createtime")]
        public BsonDateTime CreateTime { get; set; }
        public BsonBoolean IsAdmin { get; set; }
    }
}