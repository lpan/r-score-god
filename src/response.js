const token = 'CAANhtjyR1X8BANoATlQ1E4svnZBZCyZAe58vIKVZBSKqKJSIZAOwakwwjkEZA0ZAcUQzJgk5ZBLvwfzM4YG0xBA8DXzy9KSO7i0qetEBPhYiWR5Hgcf4rloBLRDaHNDeZAcXZAFCvUaei8DycZBuHV0j5Hfe7P2tsEut51EhIFP326GZBGZB9OgnmFO1jLn8G9JRqld4ZD'; // eslint-disable-line

function formatResponse(message, sender) {
  return {
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message,
    },
  };
}

export default formatResponse;