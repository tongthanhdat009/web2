
const BASE_URL = 'http://localhost/web2/server/api/QuanLyPhanQuyen/';
export async function getAllQuyen() {
    const response = await fetch(`${BASE_URL}getAllQuyen.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

export const getPhanQuyenBySelectedQuyen = async (quyenId) => {
    // Append quyenId as a query parameter
    const url = new URL(`${BASE_URL}getPhanQuyenBySelectedQuyen.php`); // Or your actual endpoint
    url.searchParams.append('IDQuyen', quyenId);
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/json', // Not strictly needed for GET if not sending body
      },
      // NO BODY for GET request
    });
    if (!response.ok) {
      const errorData = await response.text(); // Get more error details
      throw new Error(`Network response was not ok: ${response.status} ${errorData}`);
    }
    return response.json();
  };

export async function getAllChucNang() {
    const response = await fetch(`${BASE_URL}getAllChucNang.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

export async function updatePhanQuyen(requestBody) {
    console.log('Payload sent to API:', JSON.stringify(requestBody, null, 2));
  
    const response = await fetch(`${BASE_URL}updatePhanQuyen.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Log trạng thái HTTP và nội dung phản hồi
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response Text:', responseText);
  
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
  
    if (!responseText) {
      throw new Error('Server returned an empty response');
    }
  
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('Parsed JSON Response:', jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Invalid JSON response from server');
    }
}