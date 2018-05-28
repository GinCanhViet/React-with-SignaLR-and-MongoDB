using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using RealTimeUsingSignalR.Entities;
using RealTimeUsingSignalR.Models;

namespace RealTimeUsingSignalR
{
    public class ChatHub : Hub
    {
        private MessageModel _messageModel = new MessageModel();
        static List<ClientConnectedModel> _clientModel = new List<ClientConnectedModel>();
        public override Task OnConnected()
        {
            return base.OnConnected();
        }
        public override async Task OnDisconnected(bool stopCalled)
        {
            var client = (from p in _clientModel where p.ConnectionID == Context.ConnectionId select p).FirstOrDefault();
            if (client != null)
            {
                await base.Clients.Others.AlertNewUserOnline(new Message() {
                    Username = client.UserName,
                    MessageContent = $"{client.UserName} has left the chat.",
                    CreateTime = DateTime.UtcNow,
                    IsAdmin = true
                });
                _clientModel.Remove(client);
                await base.Clients.Others.UserOff(client);
                await _messageModel.Create(new Message() { Username = null, MessageContent = $"{client.UserName} has left the chat." });
            }
        }
        public async Task GetSomeLastMessages(string name)
        {
            var messages = await _messageModel.TakeSomeMessages();
            await base.Clients.Caller.GetSomeLastMessages(messages);
            Thread.Sleep(500);
            await base.Clients.All.AlertNewUserOnline(new Message() {
                Username = name,
                MessageContent = $"{name} has joined the chat.",
                CreateTime = DateTime.UtcNow,
                IsAdmin = true
            });
            _clientModel.Add(new ClientConnectedModel() { ConnectionID = Context.ConnectionId, UserName = name });
            await base.Clients.All.UserOnl(new ClientConnectedModel() { ConnectionID = Context.ConnectionId, UserName = name });
            await _messageModel.Create(new Message() { Username = null, MessageContent = $"{name} has joined the chat." });
        }

        public async Task GetListOnlineUsers()
        {
            await base.Clients.Caller.GetListOnlineUsers(_clientModel);
        }

        public async Task SendAsync(string name, string message)
        {
            try
            {
                await _messageModel.Create(new Message() { Username = name, MessageContent = message });

                await base.Clients.All.message(new Message() {
                    Username = name,
                    MessageContent = message,
                    CreateTime = DateTime.UtcNow
                });
            }
            catch (Exception ex) {
                await base.Clients.Caller.message(new Message()
                {
                    Username = null,
                    MessageContent = "Can't send message. Try again! "+ ex.Message,
                    CreateTime = DateTime.UtcNow
                });
            }
        }
    }
}