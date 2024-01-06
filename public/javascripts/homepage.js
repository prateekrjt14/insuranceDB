function navigate(page) {
    switch (page) {
      case 'addNewPatient':
        window.location.href = 'addNewPatient';
        break;
      case 'updatePatient':
        window.location.href = 'updatePatient'; 
        break;
      
      default:
        console.error('Invalid page:', page);
    }
  }
  
  async function deletePatient() {
    try {
        // Prompt user for uniqueid
        const uniqueid = prompt('Enter Unique ID of the patient to delete:');
        if (!uniqueid) {
            return; // agar cancel click kiya
        }

        // Call the server-side route to delete the patient
        const response = await fetch('/patient/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uniqueid }),
        });

        const data = await response.json();
        alert(data.message); // Display the server response
    } catch (error) {
        console.error('Error deleting patient:', error);
    }
}

async function retrievePatient() {
  try {
      const uniqueid = await new Promise((resolve) => {
          resolve(window.prompt('Enter Unique ID of the patient to retrieve:'));
      });

      if (!uniqueid) {
          return; 
      }

      window.location.href = `/patient/retrievePatient?uniqueid=${uniqueid}`;
  } catch (error) {
      console.error('Error retrieving patient:', error);
  }
}

async function filterByCity() {
  try {
      const cityName = await new Promise((resolve) => {
        resolve(window.prompt('Enter the name of the city:'));
    });
      if (!cityName) {
          return;
      }

      window.location.href = `/patient/filterByCity?cityName=${cityName}`;
  } catch (error) {
      console.error('Error filtering patients by city:', error);
  }
}