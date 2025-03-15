import aiohttp
import asyncio
from tenacity import retry, wait_exponential, stop_after_attempt
import orjson

# Define the API endpoint. (Include link from Langflow)
url = "(YOUR OWN ENDPOINT URL)"

# Define the headers
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer (YOUR OWN APPLICATION TOKEN)",  # Replace with your valid token
    "Accept-Encoding": "gzip",  # Enable compression
}

# Retry with exponential backoff
@retry(wait=wait_exponential(), stop=stop_after_attempt(3))
async def make_api_call(session, url, headers, payload):
    timeout = aiohttp.ClientTimeout(total=100)  # 10-second timeout
    async with session.post(url, headers=headers, json=payload, timeout=timeout) as response:
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = await response.read()  # Read the response as bytes
        return orjson.loads(data)  # Parse JSON using orjson

async def main(payload):
    # Use a connection pool and HTTP/2
    async with aiohttp.ClientSession(
        connector=aiohttp.TCPConnector(force_close=True, enable_cleanup_closed=True)
    ) as session:
        # Make the API call
        response_data = await make_api_call(session, url, headers, payload)
        print("API call successful!")

        # Extract and print the output message
        outputs = response_data.get("outputs", [])
        if outputs:
            first_output = outputs[0]
            results = first_output.get("outputs", [])
            if results:
                message = results[0].get("results", {}).get("message", {})
                #Final AI Agent Output
                text = message.get("text", "No output text found.")
                return text
            else:
                print("No results found in the response.")
        else:
            print("No outputs found in the response.")


'''
Main function that is used when exporting
'''
#Use this function to run the full API call
def request_response(user_input):
    # Define the payload (request body)
    export_payload = {
        "input_value": user_input,
        "output_type": "chat",
        "input_type": "chat",
        "tweaks": {},  # Minimize payload
    }
    return asyncio.run(main(export_payload))
    