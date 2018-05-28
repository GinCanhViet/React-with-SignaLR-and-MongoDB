import React from "react";
import ReactDOM from "react-dom";
import $ from 'jquery';
window.jQuery = $;
require('signalr');
import bootstrap from "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { fail } from "assert";

var createReactClass = require('create-react-class');
var chatBoxDiv = null;

const chatHubConnection = $.hubConnection();

const proxy = chatHubConnection.createHubProxy('chatHub');

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <a className="navbar-brand" href="#">Chat Demo</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" data-toggle="modal" data-target="#aboutModal">About</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
const AboutModalDialog = () => {
    return (
        <div className="modal fade" id="aboutModal" style={{ "display": "none" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <br />
                        <pre>
                            <a href="mailto:gin.canhviet@gmail.com" style={{ "color": "darkred" }}>gin.canhviet@gmail.com</a>
                            <br />
                            <a href="https://fb.me/Gin.canhviet" target="_blank">fb.me/gin.canhviet</a>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OnlineUsers = ({ onlineUsers }) => {
    return (
        <div id="right-panel" className="alert alert-light">
            <div className="btnClose">
                <button type="button" className="btn btn-success">Online</button>
            </div>
            <div className="userOnline">
                <div>
                    <div className="list-icon-pros">
                        {onlineUsers.map((user, index) =>
                            <PrintListOnlineUser key={index} user={user} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const PrintListOnlineUser = ({ user }) => {
    return (<div><span className="icon-pros"></span> <strong>{user.UserName}</strong></div>);
};

const Welcome = ({ onSubmit }) => {
    let usernameInput;
    return (
        <div className='jumbotron' style={{ "padding": "2rem", "height": "85%" }}>
            <h3>Hello!</h3>
            <pre>This is a simple real-time chat app. It's using ReactJS & SignaLR.</pre>
            <hr className="my-3" />
            <div className="panel panel-default" id="panel" style={{ "display": "none" }}>
                <form className="panel-body text-center" onSubmit={(e) => { e.preventDefault(); onSubmit(usernameInput.value); }}>
                    <div className="col-md-4 col-center-block">
                        <p>Enter your name and start chatting!</p>
                        <div className="input-group">
                            <input autoFocus type="text" id="userName" maxLength="26" className="form-control" readOnly style={{ "borderRadius": "1rem 0 0 1rem" }} placeholder="Please wait..." ref={node => { usernameInput = node; }} />
                            <span className="input-group-btn">
                                <input className="btn btn-info" style={{ "borderRadius": "0 1rem 1rem 0", "paddingLeft": "0.3rem" }} type="submit" value="Join" />
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ChatInputForm = ({ onSubmit }) => {
    let messageInput;
    return (
        <form onSubmit={e => { e.preventDefault(); onSubmit(messageInput.value); messageInput.value = ""; }}>
            <div className="alert alert-warning alert-dismissible" id="alertBlockMessage" role="alert"
                style={{ "display": "none", "padding": "0 0 1.5rem 1.25rem", "height": "18px", "fontSize": "15px" }}>
                <span id="span_alertBlockMessage">Block sending message in . . .!</span>
            </div>
            <div className="input-group" style={{ "marginTop": "15px" }}>
                <input autoFocus type="text" maxLength="369" className="form-control" style={{ "borderRadius": "1rem 0 0 1rem" }} placeholder="Type your message here..." id="message" ref={node => { messageInput = node; }} />
                <span className="input-group-btn">
                    <input id="sendmessage" className="btn btn-info" style={{ "borderRadius": "0 1rem 1rem 0", "paddingLeft": "0.3rem" }} type="submit" value="Send" />
                </span>
            </div>
        </ form>
    );
};

const ChatMessage = ({ message, username, time, isadmin }) => {
    let gvatar = null;
    let color = "";
    let className = "";
    if (isadmin || !username) { color = "red"; username = "*ADMIN*"; gvatar = "https://gravatar.com/userimage/41232141/a2d9563f546c86fe70f1e73aa6309ac0.png"; className = "admin-alert" }
    else { gvatar = username.charCodeAt(0) * 25052018 + 25051018; gvatar = 'https://www.gravatar.com/avatar/' + gvatar + '?s=24&d=identicon&r=PG'; }
    if (time) { let d = new Date(time); time = d.toLocaleDateString() + " " + d.toLocaleTimeString(); }
    return (
        <div className='chat-message-li'>
            <div className="chat-content">
                <span className={className}>
                    <img src={gvatar} alt={username} style={{ width: 30, height: 24, paddingRight: 6 }} />
                    <strong style={{ color: color }}>{username}: </strong> <span>{message}</span>
                </span>
            </div>
            <div className="chat-time">{time}</div>
        </div>);
};

const ChatMessageList = ({ messages, isWelcomeMess }) => {
    return (
        <div id="chatBox" style={{ "width": "100%", "height": "80%", "overflow": "auto", "textAlign": "left" }} >
            <div>
                {messages.map((message, index) =>
                    <ChatMessage
                        key={index}
                        message={message.MessageContent}
                        username={message.Username}
                        isadmin={message.IsAdmin}
                        time={message.CreateTime} />
                )}
            </div>
        </div>
    )
};


const Chat = ({ onSubmit, messages, onlineUsers }) => (
    <div className='jumbotron' style={{ "padding": "2rem 0 2rem 0", "height": "calc(100% - 125px)", "backgroundColor": "transparent" }}>
        <h3>Hello!</h3>
        <pre>This is a simple real-time chat app. It's using ReactJS & SignaLR.</pre>
        <hr className="my-3" />
        <div id="panel">
            <OnlineUsers onlineUsers={onlineUsers} />
            <ChatMessageList messages={messages} />
            <ChatInputForm onSubmit={onSubmit} />
        </div>
    </div>
);

const App = createReactClass({
    getInitialState() {
        chatHubConnection.start().done(function () {
            console.log("Started.");
            document.getElementById("userName").removeAttribute('readonly');
            document.getElementById("userName").setAttribute("placeholder", "Enter your name");
            proxy.invoke('getListOnlineUsers');
        });;
        proxy.on('message', (message) => {
            this.showResponseMessage(message);
        });
        proxy.on('getSomeLastMessages', (messages) => {
            this.showResponseMessage(messages.reverse(), true);
        });
        proxy.on('alertNewUserOnline', (message) => {
            this.showResponseMessage(message);
        });
        proxy.on('getListOnlineUsers', (onlineUsers) => {
            this.setState({ onlineUsers: onlineUsers });
        });
        proxy.on('userOnl', (user) => {
            let updated = this.state.onlineUsers.slice();
            updated.push(user);
            this.setState({ onlineUsers: updated });
            <Chat messages={this.state.messages} onlineUsers={this.state.onlineUsers} onSubmit={this.sendMessage} />
        });
        proxy.on('userOff', (user) => {
            let updated = this.state.onlineUsers.slice();
            let index = updated.indexOf(updated.filter(el => el.ConnectionID == user.ConnectionID)[0]);
            //let index = updated.findIndex(p => p.ConnectionID == user.ConnectionID); -- not working on IE
            if (index !== -1) updated.splice(index, 1);
            this.setState({ onlineUsers: updated });
            <Chat messages={this.state.messages} onlineUsers={this.state.onlineUsers} onSubmit={this.sendMessage} />
        });
        
        return {
            appStarted: false,
            visible: false,
            authorHandle: "",
            messages: [],
            onlineUsers: [],
            isUserSend: false,
            shouldScroll: false,
            isBlockSendMessage: false
        }
    },
    showResponseMessage(messages, isWellcome) {
        if (isWellcome) {
            this.setState({
                shouldScroll: true,
                messages: messages
            });
        }
        else {
            let updated = this.state.messages.slice();
            updated.push(messages);
            this.setState({
                shouldScroll: (chatBoxDiv.scrollTop + chatBoxDiv.clientHeight) >= chatBoxDiv.scrollHeight - 36,
                messages: updated
            });
        }
        return <Chat messages={this.state.messages} onlineUsers={this.state.onlineUsers} onSubmit={this.sendMessage} />;
    },
    componentDidMount() {
        $('#panel').css('opacity', 0)
            .slideDown(1000)
            .animate(
                { opacity: 1 },
                { queue: false, duration: 1000 }
        );
        setTimeout(function () { $("#userName").focus(); }, 1050);
        if (this.state.appStarted) {
            
        }
    },
    componentDidUpdate: function () {
        chatBoxDiv = document.getElementById("chatBox");
        this.scrollDown();
        this.onlineUsers();
    },
    blockSendMessage: function () {
        this.setState({ isBlockSendMessage: true });
        let countDown = 3;
        let x = setInterval(function () {
            if (countDown > 0) {
                $("#alertBlockMessage").show();
                document.getElementById("span_alertBlockMessage").innerHTML = "Block sending message in: " + countDown + " second(s)";
                document.getElementById("message").setAttribute("placeholder", "Block sending message in: " + countDown + " second(s)");
                countDown--;
            }
            else {
                this.setState({ isBlockSendMessage: false });
                $("#alertBlockMessage").hide();
                document.getElementById("message").setAttribute("placeholder", "Type your message here...");
                clearInterval(x);
            }
        }.bind(this), 900);
    },
    sendMessage(messageText) {
        if (this.state.isBlockSendMessage) return;
        proxy.invoke('sendAsync', this.state.authorHandle, messageText)
            .done(() => { this.setState({ isUserSend: true }); this.blockSendMessage(); })
            .fail(() => { alert('Something went wrong when calling server, it might not be up and running.') });
    },
    scrollDown() {
        if (!chatBoxDiv) return;
        if (this.state.isUserSend) {
            chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
            this.setState({ isUserSend: false });
        }
        if (this.state.shouldScroll && !this.state.isUserSend) {
            chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
        }
    },
    connected(author) {
        proxy.invoke('getSomeLastMessages', author).done(() => { })
            .fail(() => { alert('Something went wrong when calling server, it might not be up and running.') });
    },
    userNameSubmit(author) {
        if (!author || author.trim() === "") {
            alert("Please enter your name!");
        } else {
            this.setState({ authorHandle: author });
            this.connected(author);
        }
    },
    onlineUsers() {
        let isShow = false;
        $(".btnClose").on('click', function () {
            if (isShow) {
                $('#right-panel').css({ 'right': '-200px' });
                isShow = false;
            }
            else {
                $('#right-panel').css({ 'right': '0px' });
                isShow = true;
            }
        });
    },
    render() {
        document.getElementsByTagName("META")[2].content = atob("Z2luLmNhbmh2aWV0QGdtYWlsLmNvbQ==");
        if (this.state.authorHandle === '') {
            return (
                <React.Fragment>
                    <Navbar />
                    <Welcome onSubmit={author => {
                        this.userNameSubmit(author);
                    }} />
                    <AboutModalDialog />
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <Navbar />
                    <Chat messages={this.state.messages} onlineUsers={this.state.onlineUsers} onSubmit={this.sendMessage} />
                    <AboutModalDialog />
                </React.Fragment>
            );
        }
    }
});

ReactDOM.render(<App />, document.getElementById("app")); 