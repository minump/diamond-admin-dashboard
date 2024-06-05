

export async function singleNodeTask(data: any) {
  try {
    const response = await fetch(`/api/single_node_task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error('Error in singleNodeTask:', error);
  }
}

export async function registerContainer(data: any) {
  try {
    const response = await fetch(`/api/register_container`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error('Error in registerContainer:', error);
  }
}

export async function multiNodeTask(data: any) {
  try {
    const response = await fetch(`${process.env.VERCEL_URL}/api/multi_node_task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error('Error in multiNodeTask:', error);
  }
}

export async function getOAuth2UrlAndLogin() {
  const response = await fetch(`/api/get_oauth2_url_and_login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}