import { toast } from '@/components/ui/use-toast';

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

export async function registerContainer(data: {
  base_image: string;
  container_type: string;
  name: string;
  description: string;
}): Promise<any> {
  try {
    const response = await fetch('/api/register_container', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!response.ok) {
      console.log('response:', response);
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    console.log('register container response: ', responseData);
    toast({
      title: 'Success',
      description: responseData.message
    });
    return responseData;
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
