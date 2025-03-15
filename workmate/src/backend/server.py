# import module
import rel
import websocket
import websocket_server
import threading

# start_threaded = False
# terminate = False
#
# def user_input(ws):
#     message = ""
#     while message != "exit":
#         message = input("Enter a message ('exit' to terminate): ")
#         ws.send(message)
#     ws.close()
#
# def on_message(ws, message):
#     print("Received:", message)
#     global start_threaded
#     start_threaded = True
#     if start_threaded:
#         threading.Thread(target=user_input, args=(ws,), daemon=True).start()
#
#
# def on_error(ws, error):
#     print(error)
#
# def on_close(ws, close_status_code, close_msg):
#     print("websocket closed")
#
# def on_open(ws):
#     print("Python client")
#     ws.send("Python joining")

    # message = ""
    # while message != "exit":
    #     message = input("Enter a message ('exit' to terminate): ")
    #     ws.send(message)
    # ws.close()
    # exit()

# if __name__ == '__main__':
#     websocket.enableTrace(False) # use for debugging
#     ws = websocket.WebSocketApp("ws://localhost:8080",
#                                 on_open=on_open,
#                                 on_message=on_message,
#                                 on_error=on_error,
#                                 on_close=on_close)
#     ws.run_forever(dispatcher=rel,
#                    reconnect=5)  # Set dispatcher to automatic reconnection, 5 second reconnect delay if connection closed unexpectedly
#     rel.signal(2, rel.abort)  # Keyboard Interrupt
#     rel.dispatch()



# const [socket, setSocket] = useState(null);
#   // connects to websocket, use this once the user joins the lobby screen
#   useEffect(() => {
#     const socket = new WebSocket("ws://localhost:8000") // change local host to ip of ec2 during production use
#
#     setSocket(socket);
#
#     socket.onopen = () => {
#       console.log("WebSocket Connected");
#       socket.send("Hello Server");
#     };
#
#   // receiving messages from websocket, use where needed to communicate with
#   // the backend
#     socket.onmessage = (event) => {
#         console.log("Received:", event.data);
#     };
#
#   // error handling
#     socket.onerror = (error) => {
#         console.error("WebSocket Error:", error);
#     };
#
#   // upon leaving the socket (exiting the app entirely)
#     socket.onclose = () => {
#         console.log("WebSocket Disconnected");
#     };
#   }, [])
#
#   // IMPORTANT call this when you are exiting the app to ensure the connection
#   // is broken
#   //   if (socket.readyState === WebSocket.OPEN) {
#   //       socket.close()
#     // }


# data protocol
# (context);(data) eg. login;username



users = []

user_lobbies = {'maths': [],
                'biology': [],
                'physics': [],
                'chemistry': []}

class User:
    def __init__(self, id, username, client):
        self.id = id
        self.username = username
        self.client = client
        self.position = None
        self.lobby_code = None


def login(client, server, username):
    client = User(client['id'], username, client)
    users.append(client)

def join_lobby(user, server, lobby):
    user_lobbies[lobby].append(user)

def leave_lobby(user, server, lobby):
    index = -1
    for i in range(len(user_lobbies[lobby])):
        if user_lobbies[i].id == user.id:
            index = i
    if index == -1:
        print("something is wrong in leave lobby")
    user = user_lobbies[lobby]


# Function to handle new client connections
def new_client(client, server):
    print(f"New client connected: {client['id']}")
    # server.send_message(client, "Welcome to the WebSocket server!")
    # clients.append(client)
    # print(f"Length: {len(clients)}")

# Function to handle received messages
def message_received(client, server, message):
    """
    message structure -
    context;data
    context:
    - login
    - join_lobby
    - leave_lobby
    - send_text_chat
    """

    message_data = message.split(';')

    match message_data[0]:
        case 'login':
            login(client, server, message_data[1])

        case 'join_lobby':
            index = -1
            for i in range(len(users)):
                if users[i].client['id'] == client[id]:
                    index = i
                    break
            if index == -1:
                print("something is wrong in join lobby")
            else:
                user = users[index]
                join_lobby(user, server, message_data[1])

        case 'leave_lobby':
            index = -1
            for i in range(len(users)):
                if users[i].client['id'] == client[id]:
                    index = i
                    break
            if index == -1:
                print("something is wrong in leave lobby")

            leave_lobby(client, server, message_data[1])

        case 'send_text_chat':
            pass

    print(f"Received: {message} from client {client['id']}")
    server.send_message(client, f"Echo: {message}")

def client_left(client, server):
    print(f"Client {client['id']} left")

if __name__ == '__main__':
    print("server started")
    server = websocket_server.WebsocketServer(host="0.0.0.0", port=8000)  # Allow external connections
    server.set_fn_new_client(new_client)
    server.set_fn_message_received(message_received)
    server.set_fn_client_left(client_left)
    server.run_forever()
    print("server ended")
