using System;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Driver;
using RealTimeUsingSignalR.Entities;
using MongoDB.Driver.Linq;
using System.Threading.Tasks;

namespace RealTimeUsingSignalR.Models
{
    public class MessageModel
    {
        private MongoUrl mongoUrl;
        private IMongoCollection<Message> messagesCollection;

        public MessageModel()
        {
            //Create a mongoDB free: https://mlab.com/
            mongoUrl = new MongoUrl(@"your connection string here");
            var mongoClient = new MongoClient(mongoUrl);
            var mongoDatabase = mongoClient.GetDatabase(mongoUrl.DatabaseName);
            messagesCollection = mongoDatabase.GetCollection<Message>("messages");
        }
        public async Task<List<Message>> FindAll()
        {
            return await messagesCollection.AsQueryable().ToListAsync();
        }
        public async Task Create(Message message)
        {
            await messagesCollection.InsertOneAsync(new Message() {
                CreateTime = DateTime.UtcNow,
                MessageContent = message.MessageContent,
                Username = message.Username
            });
        }
        public async Task<List<Message>> TakeSomeMessages()
        {
            return await messagesCollection.AsQueryable().OrderByDescending(m => m.CreateTime).Take(69).ToListAsync();
        }
    }
}