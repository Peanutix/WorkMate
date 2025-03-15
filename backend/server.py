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
        try:
            await u.websocket.send(message)
        except Exception:
            print("Failed to send message to " + u.username)
            lobby_users.remove(u)

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
        user_obj = next((u for u in users if u.websocket == websocket), None)
        if user_obj:
            if user_obj.lobby_code:
                await leave_lobby(user_obj, user_obj.lobby_code)
                users.remove(user_obj)

    # Optionally, clean up users or lobbies here if needed.


if __name__ == '__main__':
    async def main():
        start_server = await websockets.serve(handler, "3.107.255.250", 8000)
        # start_server = await websockets.serve(handler, "0.0.0.0", 8000)
        print("[SERVER] Server started")

        # Start the periodic user update task
        asyncio.create_task(update_lobby_user_list())

        # Keep the server running
        await start_server.wait_closed()


    asyncio.run(main())  # Use asyncio.run() for proper event loop management



