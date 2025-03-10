
export async function fetchInactiveStores() {
    try {
      const response = await fetch(`/api/stores/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }
      
      const data = await response.json();
      console.log("data",data);
      return data;
    } catch (error) {
      console.error('Error fetching inactive stores:', error);
      throw error;
    }
  }