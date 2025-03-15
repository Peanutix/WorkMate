import rel
import websocket
import websocket_server
import threading

users = []  # list of User objects
user_lobbies = {
    'maths': [],
    'biology': [],
    'physics': [],
    'chemistry': []
}

class User:
    def __init__(self, id, username, client):
        self.id = id
        self.username = username
        self.client = client  # the underlying client dict from websocket_server
        self.lobby_code = None

def broadcast_lobby_update(server, lobby_name):
    """Send the updated list of usernames to everyone in the lobby."""
    lobby_users = user_lobbies[lobby_name]
    # gather usernames in this lobby
    user_list = [u.username for u in lobby_users]
    # build a string, e.g. "lobby_update;["ahmed","alice","bob"]"
    # or you can do "lobby_update;ahmed,bob,alice" if you prefer
    # We'll do a simple comma-separated list:
    user_list_str = ",".join(user_list)
    message = f"lobby_update;{user_list_str}"

    # send to every user in this lobby
    for u in lobby_users:
        server.send_message(u.client, message)

def login(client_dict, server, username):
    new_user = User(client_dict['id'], username, client_dict)
    users.append(new_user)
    print(f"[SERVER] User {username} logged in with id={client_dict['id']}")

def join_lobby(user, server, lobby_name):
    user.lobby_code = lobby_name
    user_lobbies[lobby_name].append(user)
    print(f"[SERVER] {user.username} joined lobby '{lobby_name}'")
    # broadcast the updated list
    broadcast_lobby_update(server, lobby_name)

def leave_lobby(user, server, lobby_name):
    lobby_list = user_lobbies[lobby_name]
    index = -1
    for i, u in enumerate(lobby_list):
        if u.id == user.id:
            index = i
            break
    if index == -1:
        print(f"[SERVER] Error: {user.username} not found in {lobby_name}")
        return

    removed = lobby_list.pop(index)
    print(f"[SERVER] {removed.username} left lobby '{lobby_name}'")
    # broadcast the updated list
    broadcast_lobby_update(server, lobby_name)

def new_client(client, server):
    print(f"[SERVER] New client connected: {client['id']}")

def client_left(client, server):
    print(f"[SERVER] Client {client['id']} left")
    # Optionally remove them from `users` and from their lobby
    # if you want to keep things perfectly in sync.
    leaving_user = None
    for u in users:
        if u.client['id'] == client['id']:
            leaving_user = u
            break

    if leaving_user:
        # If they're in a lobby, remove them
        if leaving_user.lobby_code:
            leave_lobby(leaving_user, server, leaving_user.lobby_code)
        # Also remove from global "users"
        users.remove(leaving_user)

def message_received(client, server, message):
    print(f"[SERVER] Received: {message} from client {client['id']}")
    parts = message.split(';', 1)
    if len(parts) < 2:
        return  # Malformed message
    context, data = parts[0], parts[1]

    if context == "login":
        login(client, server, data)

    elif context == "join_lobby":
        user_obj = None
        for u in users:
            if u.client['id'] == client['id']:
                user_obj = u
                break
        if not user_obj:
            print("[SERVER] Error: user not found in join_lobby")
        else:
            join_lobby(user_obj, server, data)

    elif context == "leave_lobby":
        user_obj = None
        for u in users:
            if u.client['id'] == client['id']:
                user_obj = u
                break
        if not user_obj:
            print("[SERVER] Error: user not found in leave_lobby")
        else:
            leave_lobby(user_obj, server, data)

    elif context == "send_text_chat":
        pass
        # Example: you could broadcast chat messages to the lobby

    # Echo back to sender so they know the server processed it
    server.send_message(client, f"Echo: {message}")

if __name__ == '__main__':
    print("[SERVER] Starting up...")
    server = websocket_server.WebsocketServer(host="0.0.0.0", port=8000)
    server.set_fn_new_client(new_client)
    server.set_fn_message_received(message_received)
    server.set_fn_client_left(client_left)
    server.run_forever()
    print("[SERVER] Server ended")
