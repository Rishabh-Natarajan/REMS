function fetchProperties() {
    const priceFilter = document.getElementById('priceFilter').value;
    const parkingFilter = document.getElementById('parkingFilter').checked ? 'Y' : '';
    const gardenFilter = document.getElementById('gardenFilter').checked ? 'Y' : '';
    const swimmingPoolFilter = document.getElementById('swimmingPoolFilter').checked ? 'Y' : '';
    const homeTheatreFilter = document.getElementById('homeTheatreFilter').checked ? 'Y' : '';
  
    const queryParams = [];
    if (priceFilter) {
      queryParams.push(`price=${priceFilter}`);
    }
    if (parkingFilter) {
      queryParams.push(`parking=${parkingFilter}`);
    }
    if (gardenFilter) {
      queryParams.push(`garden=${gardenFilter}`);
    }
    if (swimmingPoolFilter) {
      queryParams.push(`swimmingPool=${swimmingPoolFilter}`);
    }
    if (homeTheatreFilter) {
      queryParams.push(`homeTheatre=${homeTheatreFilter}`);
    }
    const queryString = queryParams.join('&');
  
    fetch(`http://localhost:3002/fetch_properties?${queryString}`)
      .then(response => response.json())
      .then(data => {
        const propertiesBody = document.getElementById('propertiesBody');
        propertiesBody.innerHTML = ''; // Clear existing rows
        
        data.forEach(property => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${property.Property_ID}</td>
            <td>${property.Tenant_ID}</td>
            <td>${property.Address}</td>
            <td>${property.Rooms}</td>
            <td>${property.Bedrooms}</td>
            <td>${property.Area}</td>
            <td>${property.Price}</td>
          `;
          propertiesBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
      });
  }
