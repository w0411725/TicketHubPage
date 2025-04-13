    // Update concert ID on selection
    document.querySelectorAll('.concert-card').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.concert-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          document.getElementById('concertId').value = card.dataset.id;
        });
      });
  
      document.getElementById('ticketForm').addEventListener('submit', async function (e) {
        e.preventDefault();
  
        const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isValidPhone = phone => /^[0-9\-\s]{10,15}$/.test(phone);
        const isValidCreditCard = card => /^[0-9]{13,19}$/.test(card.replace(/[\s\-]/g, ''));
        const isValidExpiration = exp => /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
        const isValidSecurityCode = code => /^\d{3,4}$/.test(code);
        const isValidPostalCode = code => /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(code);
  
        const form = e.target;
        const data = {
          concertId: parseInt(form.concertId.value),
          quantity: parseInt(form.quantity.value),
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          phone: form.phone.value.trim(),
          creditCard: form.creditCard.value.replace(/[\s\-]/g, ''),
          expiration: form.expiration.value.trim(),
          securityCode: form.securityCode.value.trim(),
          address: form.address.value.trim(),
          city: form.city.value.trim(),
          province: form.province.value.trim(),
          postalCode: form.postalCode.value.trim(),
          country: form.country.value.trim()
        };
  
        const errors = [];
        if (isNaN(data.concertId) || data.concertId < 0) errors.push("Concert ID must be valid.");
        if (isNaN(data.quantity) || data.quantity < 1 || data.quantity > 20) errors.push("Quantity must be between 1 and 20.");
        if (!data.name) errors.push("Name is required.");
        if (!isValidEmail(data.email)) errors.push("Invalid email address.");
        if (!isValidPhone(data.phone)) errors.push("Invalid phone number.");
        if (!isValidCreditCard(data.creditCard)) errors.push("Credit card must be 13–19 digits.");
        if (!isValidExpiration(data.expiration)) errors.push("Expiration must be in MM/YY format.");
        if (!isValidSecurityCode(data.securityCode)) errors.push("Security code must be 3 or 4 digits.");
        if (!data.address) errors.push("Address is required.");
        if (!data.city) errors.push("City is required.");
        if (!data.province) errors.push("Province is required.");
        if (!isValidPostalCode(data.postalCode)) errors.push("Invalid postal code.");
        if (!data.country) errors.push("Country is required.");
  
        if (errors.length > 0) {
          alert("Please fix the following errors:\n\n" + errors.join("\n"));
          return;
        }
  
        try {
          const response = await fetch('https://tickethub-api-w0411725.azurewebsites.net/api/Purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
  
          if (response.ok) {
            alert("Purchase submitted successfully!");
            form.reset();
            document.querySelectorAll('.concert-card').forEach(c => c.classList.remove('selected'));
          } else {
            alert("Server error. Please try again.");
            console.error(await response.text());
          }
        } catch (err) {
          alert("Failed to submit.");
          console.error(err);
        }
      });