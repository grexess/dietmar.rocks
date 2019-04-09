import './header.html';


Template.header.events({

    'click #btnAddCard'(event, instance) {
        document.getElementById("addCard").style.display = "block";
    }

  });
