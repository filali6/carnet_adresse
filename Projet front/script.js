function Contact(civilite, nom, prenom, telephone,id) {
    this.civilite = civilite;
    this.nom = nom;
    this.prenom = prenom;
    this.telephone = telephone;
    this.id=id;
  }
$(document).ready(function() {
    
    const getContacts = () => {
      const storedContactsJSON = localStorage.getItem('contacts');
      return storedContactsJSON ? JSON.parse(storedContactsJSON) : [];
    };
    const getIdCount = () => {
      const storedContactsJSON = localStorage.getItem('idcount');
      return storedContactsJSON ? parseInt(JSON.parse(storedContactsJSON)) : 0;
    };
  
    
    const setContacts = (contacts) => {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    };
    const setIdCount = (count) => {
      localStorage.setItem('idcount', JSON.stringify(count));
    };
    
    const updateContactList = (contacts) => {
      const contactList = $('#contactList');
      contactList.empty(); 
      if (contacts.length === 0) {
        contactList.append('<p>Aucun contact pour le moment.</p>');
      } else {
        contacts.forEach(contact => {
          const contactItem = $('<li>');
          contactItem.text(`${contact.civilite} ${contact.nom} ${contact.prenom}`);
          contactList.append(contactItem);
        });
      }
    };
    const showContactForm = () => {
      const contactForm = $('.formulaire');
      contactForm.toggleClass('active');  
    };
  
     
    const handleSaveContact = (event) => {
    
      const civilite = $('#civilite').val();
      const nom = $('#nom').val();
      const prenom = $('#prenom').val();
      const telephone = $('#telephone').val();
      let id;
      if($('#contactId').val()==""){ id=getIdCount();setIdCount(id+1);}
      else { id =parseInt($('#contactId').val());}
      const newContact = new Contact(civilite, nom, prenom, telephone,id);
  
      const contacts = getContacts();

      //partie ajoutée lors de la validation en classe 
      const existingPhone = contacts.find(contact => contact.telephone === telephone);
      if (existingPhone) {
          alert("Impossible d'ajouter le contact.Ce numéro de téléphone existe déjà");
          return;  
      }
      
        const existingContact = contacts.find(contact => contact.id === id);
         
        if (existingContact) {
            
            existingContact.civilite = civilite;
            existingContact.nom = nom;
            existingContact.prenom = prenom;
            existingContact.telephone = telephone;
        }
       
      else {
          // Sinon, il s'agit d'un nouvel ajout, donc ajouter simplement le contact à la liste
          contacts.push(newContact);
      }
      contacts.sort((a, b) => a.nom.localeCompare(b.nom) || a.prenom.localeCompare(b.prenom));
      
      setContacts(contacts);
      updateContactList(contacts);
      showContactForm();    
  };

     const showContactDetails = (contact) => {
        $('#civiliteInfo').text(`Civilité: ${contact.civilite}`);
        $('#nomInfo').text(`Nom: ${contact.nom}`);
        $('#prenomInfo').text(`Prénom: ${contact.prenom}`);
        $('#telephoneInfo').text(`Téléphone: ${contact.telephone}`);
        $('#idInfo').text(`id: ${contact.id}`);
        const contactDetails = $('#contactDetails');
        contactDetails.toggleClass('active');
    };

    $('#contactList').on('click', 'li', function() {
        const contactCliqué = $(this);  
        contactCliqué.addClass('surligné');  
        $('#contactList').find('li').removeClass('surligné');  
        contactCliqué.addClass('surligné');
         const index = $(this).index();
        
         const contacts = getContacts();
        
         if (index >= 0 && index < contacts.length) {
             const contact = contacts[index];
            
             showContactDetails(contact);
        }
    });

    const fillContactForm = (contact) => {
    $('#civilite').val(contact.civilite);
    $('#nom').val(contact.nom);
    $('#prenom').val(contact.prenom);
    $('#telephone').val(contact.telephone);
    $('#contactId').val(contact.id);
    };

    
  // bouton Editer le contact 
  $('#editContactBtn').on('click', function() {
    const contactDetails = $('#contactDetails');
    const contactForm = $('.formulaire');

    // Récupérer les données du contact  
    const civilite = $('#civiliteInfo').text().split(':')[1].trim();
    const nom = $('#nomInfo').text().split(':')[1].trim();
    const prenom = $('#prenomInfo').text().split(':')[1].trim();
    const telephone = $('#telephoneInfo').text().split(':')[1].trim();
    const id = $('#idInfo').text().split(':')[1].trim();

    // remplir le formulaire d'ajout de contact avec les données du contact sélectionné
    fillContactForm({ civilite, nom, prenom, telephone ,id });

    // Cacher l'encart de détails et afficher le formulaire
    contactDetails.removeClass('active');
    contactForm.addClass('active');
    });

  //fonction pour effacer tous les contacts quand on clique sur le bouton supprimer 
    const handleDeleteContact = (event) => {
        event.preventDefault();  
    
        localStorage.removeItem('contacts');  
        const contactList = $('#contactList');
        contactList.empty();  
        contactList.append('<p>Aucun contact pour le moment.</p>');
    };
  
     const contacts = getContacts();
   
    updateContactList(contacts);

    const clearButton = document.getElementById('effacerBtn');  
    const form = document.querySelector('form');  
    clearButton.addEventListener('click', () => {
       form.reset(); 
    });
  
    // Event Listeners
    $('#newContactBtn').on('click', function() {
        showContactForm();
    });
    $('#deleteContactBtn').on('click', handleDeleteContact);

    $('#enregistrerBtn').on('click', handleSaveContact);
    
  })