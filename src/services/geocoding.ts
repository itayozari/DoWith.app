interface Location {
  id: string;
  lat: number;
  lng: number;
  address: string;
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (query.length < 3) return [];

  try {
    const searchQuery = `${query}, Tel Aviv, Israel`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=10&countrycodes=il`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'DoWith-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data = await response.json();
    
    return data
      .filter((item: any) => {
        // Filter to only include results in Tel Aviv
        const address = item.address || {};
        return address.city === 'Tel Aviv' || 
               address.city === 'Tel Aviv-Yafo' || 
               address.town === 'Tel Aviv' ||
               address.suburb?.includes('Tel Aviv');
      })
      .map((item: any) => ({
        id: item.place_id.toString(),
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        address: item.display_name
          .split(',') // Split the full address
          .slice(0, 3) // Take only the first 3 parts
          .join(',') // Join them back
          .trim()
      }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}