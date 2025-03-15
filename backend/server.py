# import json
# import time
#
# import rel
# import websocket
# import websocket_server
# import threading
#
# from qdrant_client.parallel_processor import max_internal_batch_size
#
# users = []  # list of User objects
# user_lobbies = {
#     'maths': [],
#     'biology': [],
#     'physics': [],
#     'chemistry': []
# }
#
# lobby_drawings = {
#     'maths': None,
#     'biology': None,
#     'physics': None,
#     'chemistry': None
# }
#
# class User:
#     def __init__(self, id, username, client):
#         self.id = id
#         self.username = username
#         self.client = client  # the underlying client dict from websocket_server
#         self.lobby_code = ""
#
# def broadcast_lobby_update(server, lobby_name):
#     """Send the updated list of usernames to everyone in the lobby."""
#     lobby_users = user_lobbies[lobby_name]
#     # gather usernames in this lobby
#     user_list = [u.username for u in lobby_users]
#     # We'll do a simple comma-separated list:
#     user_list_str = ",".join(user_list)
#     message = f"lobby_update${user_list_str}"
#
#     # send to every user in this lobby
#     for u in lobby_users:
#         server.send_message(u.client, message)
#
#
# def login(client_dict, server, username):
#     new_user = User(client_dict['id'], username, client_dict)
#     users.append(new_user)
#     print(f"[SERVER] User {username} logged in with id={client_dict['id']}")
#
# def join_lobby(user, server, lobby_name):
#     user.lobby_code = lobby_name
#     user_lobbies[lobby_name].append(user)
#     print(f"[SERVER] {user.username} joined lobby '{lobby_name}'")
#     # broadcast the updated list
#     broadcast_lobby_update(server, lobby_name)
#     if lobby_drawings[lobby_name]:
#         print("should update")
#         server.send_message(user.client, "drawing$" + lobby_drawings[lobby_name])
#
#
# def leave_lobby(user, server, lobby_name):
#     if lobby_name == "":
#         return
#
#     lobby_list = user_lobbies[lobby_name]
#     index = -1
#     for i, u in enumerate(lobby_list):
#         if u.id == user.id:
#             index = i
#             break
#     if index == -1:
#         print(f"[SERVER] Error: {user.username} not found in {lobby_name}")
#         return
#
#     removed = lobby_list.pop(index)
#     removed.lobby_code = ""
#     print(f"[SERVER] {removed.username} left lobby '{lobby_name}'")
#     # broadcast the updated list
#     broadcast_lobby_update(server, lobby_name)
#
# def new_client(client, server):
#     print(f"[SERVER] New client connected: {client['id']}")
#
# def client_left(client, server):
#     print(f"[SERVER] Client {client['id']} left")
#     # Optionally remove them from `users` and from their lobby
#     # if you want to keep things perfectly in sync.
#     leaving_user = None
#     for u in users:
#         if u.client['id'] == client['id']:
#             leaving_user = u
#             break
#
#     if leaving_user:
#         # If they're in a lobby, remove them
#         if leaving_user.lobby_code:
#             leave_lobby(leaving_user, server, leaving_user.lobby_code)
#         # Also remove from global "users"
#         users.remove(leaving_user)
#
# def message_received(client, server, message):
#     parts = message.split('$')
#     if len(parts) < 2:
#         return  # Malformed message
#     context, data = parts[0], parts[1]
#
#     if context == "login":
#         login(client, server, data)
#
#     elif context == "join_lobby":
#         user_obj = None
#         for u in users:
#             if u.client['id'] == client['id']:
#                 user_obj = u
#                 break
#         if not user_obj:
#             print("[SERVER] Error: user not found in join_lobby")
#         else:
#             join_lobby(user_obj, server, data)
#
#     elif context == "leave_lobby":
#         user_obj = None
#         for u in users:
#             if u.client['id'] == client['id']:
#                 user_obj = u
#                 break
#         if not user_obj:
#             print("[SERVER] Error: user not found in leave_lobby")
#         else:
#             print("Leaving lobby:", user_obj.lobby_code)
#             leave_lobby(user_obj, server, user_obj.lobby_code)
#
#     elif context == "send_text_chat":
#         pass
#         # Example: you could broadcast chat messages to the lobby
#
#     elif context == "return_login":
#         user_obj = None
#         for u in users:
#             if u.client['id'] == client['id']:
#                 user_obj = u
#                 users.remove(user_obj)
#                 break
#         if not user_obj:
#             print("[SERVER] Error: user not found in join_lobby")
#
#     elif context == "drawing":
#         drawing_data = json.loads(data)  # Parse JSON drawing data
#         lobby_name = drawing_data.get("lobby")
#         image_data = drawing_data.get("data")
#
#         if lobby_name and image_data:
#             lobby_drawings[lobby_name] = data
#
#             for user in user_lobbies[lobby_name]:
#                 server.send_message(user.client, "drawing$" + lobby_drawings[lobby_name])
#
#
# def update_lobby_user_list(server):
#     """Periodically send updates to all users in each lobby."""
#     while True:
#         for lobby_name, lobby_users in user_lobbies.items():
#             # Only broadcast if there are users in the lobby
#             if lobby_users:
#                 broadcast_lobby_update(server, lobby_name)
#         time.sleep(1)
#
# if __name__ == '__main__':
#     print("[SERVER] Starting up...")
#     server = websocket_server.WebsocketServer(host="0.0.0.0", port=8000, max_size=16 * 1024 * 1024)
#     server.set_fn_new_client(new_client)
#     server.set_fn_message_received(message_received)
#     server.set_fn_client_left(client_left)
#
#     update_thread = threading.Thread(target=update_lobby_user_list, args=(server, ))
#     update_thread.daemon = True
#     update_thread.start()
#     server.run_forever()
#     print("[SERVER] Server ended")

import json
import asyncio
import websockets
from websockets import WebSocketServerProtocol

users = []  # list of User objects
user_lobbies = {
    'maths': [],
    'biology': [],
    'physics': [],
    'chemistry': []
}

lobby_drawings = {
    'maths': None,
    'biology': None,
    'physics': None,
    'chemistry': None
}

class User:
    def __init__(self, id, username, websocket):
        self.id = id
        self.username = username
        self.websocket = websocket  # the underlying WebSocket object
        self.lobby_code = ""


async def broadcast_lobby_update(lobby_name):
    """Send the updated list of usernames to everyone in the lobby."""
    lobby_users = user_lobbies[lobby_name]
    user_list = [u.username for u in lobby_users]
    user_list_str = ",".join(user_list)
    message = f"lobby_update${user_list_str}"

    # send to every user in this lobby
    for u in lobby_users:
        await u.websocket.send(message)


async def login(websocket, username):
    user = User(id=id(websocket), username=username, websocket=websocket)
    users.append(user)
    print(f"[SERVER] User {username} logged in with id={id(websocket)}")


async def join_lobby(user, lobby_name):
    user.lobby_code = lobby_name
    user_lobbies[lobby_name].append(user)
    print(f"[SERVER] {user.username} joined lobby '{lobby_name}'")
    # broadcast the updated list
    await broadcast_lobby_update(lobby_name)
    if lobby_drawings[lobby_name]:
        print("should update")
        await user.websocket.send("drawing$" + lobby_drawings[lobby_name])


async def leave_lobby(user, lobby_name):
    if lobby_name == "":
        return

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
    removed.lobby_code = ""
    print(f"[SERVER] {removed.username} left lobby '{lobby_name}'")
    # broadcast the updated list
    await broadcast_lobby_update(lobby_name)


async def message_received(websocket, message):
    parts = message.split('$')
    if len(parts) < 2:
        return  # Malformed message
    context, data = parts[0], parts[1]

    if context == "login":
        await login(websocket, data)

    elif context == "join_lobby":
        user_obj = next((u for u in users if u.websocket == websocket), None)
        if not user_obj:
            print("[SERVER] Error: user not found in join_lobby")
        else:
            await join_lobby(user_obj, data)

    elif context == "leave_lobby":
        user_obj = next((u for u in users if u.websocket == websocket), None)
        if not user_obj:
            print("[SERVER] Error: user not found in leave_lobby")
        else:
            print("Leaving lobby:", user_obj.lobby_code)
            await leave_lobby(user_obj, user_obj.lobby_code)

    elif context == "send_text_chat":
        pass
        # Example: you could broadcast chat messages to the lobby

    elif context == "return_login":
        user_obj = next((u for u in users if u.websocket == websocket), None)
        if user_obj:
            users.remove(user_obj)

    elif context == "drawing":
        drawing_data = json.loads(data)  # Parse JSON drawing data
        lobby_name = drawing_data.get("lobby")
        image_data = drawing_data.get("data")

        if lobby_name and image_data:
            lobby_drawings[lobby_name] = data

            for user in user_lobbies[lobby_name]:
                await user.websocket.send("drawing$" + lobby_drawings[lobby_name])


async def update_lobby_user_list():
    """Periodically send updates to all users in each lobby."""
    while True:
        for lobby_name, lobby_users in user_lobbies.items():
            # Only broadcast if there are users in the lobby
            if lobby_users:
                await broadcast_lobby_update(lobby_name)
        await asyncio.sleep(1)


async def handler(websocket, path):
    try:
        async for message in websocket:
            await message_received(websocket, message)
    except websockets.exceptions.ConnectionClosed:
        print(f"[SERVER] Client {websocket} disconnected")
        # Handle the disconnection

    # Optionally, clean up users or lobbies here if needed.


if __name__ == '__main__':
    print("[SERVER] Starting up...")
    start_server = websockets.serve(handler, "0.0.0.0", 8000)

    # Create an event loop and start the server
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)

    # Start the periodic user update
    loop.create_task(update_lobby_user_list())

    print("[SERVER] Server started")
    loop.run_forever()
