import aiohttp
import asyncio
from tenacity import retry, wait_exponential, stop_after_attempt
import orjson

# Define the API endpoint
url = "PLACE API ENDPOINT HERE"

# Define the headers
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer (PLACE KEY HERE)",  # Replace with your valid token
    "Accept-Encoding": "gzip",  # Enable compression
}

# Define the payload (request body)
payload = {
    "input_value": "Provide me a biology question",
    "output_type": "chat",
    "input_type": "chat",
    "tweaks": {},  # Minimize payload
}

# Retry with exponential backoff
@retry(wait=wait_exponential(), stop=stop_after_attempt(3))
async def make_api_call(session, url, headers, payload):
    timeout = aiohttp.ClientTimeout(total=10)  # 10-second timeout
    async with session.post(url, headers=headers, json=payload, timeout=timeout) as response:
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = await response.read()  # Read the response as bytes
        return orjson.loads(data)  # Parse JSON using orjson

async def main():
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
                text = message.get("text", "No output text found.")
                print("Langflow response:", text)
            else:
                print("No results found in the response.")
        else:
            print("No outputs found in the response.")

# Run the asynchronous function
asyncio.run(main())