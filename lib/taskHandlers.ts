import { cookies } from 'next/headers';

export async function singleNodeTask(data: any) {
  try {
    const response = await fetch(`/api/single_node_task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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
    const tokens = cookies().get('tokens');
    const headers: Record<string, string> = {};
    if (tokens) {
      // headers['Authorization'] = `Bearer ${tokens.value}`;
      headers['Content-Type'] = 'application/json';
      headers['Cookie'] = `tokens=${JSON.stringify(tokens)}`;
    }
    const response = await fetch(`/api/register_container`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
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
    const response = await fetch(
      `${process.env.VERCEL_URL}/api/multi_node_task`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error('Error in multiNodeTask:', error);
  }
}
