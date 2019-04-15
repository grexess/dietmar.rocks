import './footer.html';

Template.footer.onCreated(function () {
    Session.set('showDelBtn', false);
})

Template.footer.events({
    'change #delOption'(event) {
        event.preventDefault();
        Session.set('showDelBtn', $('#delOption').is(":checked"));
    }
})