import ModalComponent from 'ember-quickstart/components/modal-base';
import RSVP from 'rsvp';

export default ModalComponent.extend({
    actions: {
        confirm() {
            this.confirm();
            this.send('closeModal');
        }
    },

    // Allowed actions
    confirm: () => RSVP.resolve()
});
