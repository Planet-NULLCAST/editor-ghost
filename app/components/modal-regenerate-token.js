import ModalComponent from 'ember-quickstart/components/modal-base';

export default ModalComponent.extend({
    actions: {
        confirm() {
            this.confirm();
            this.send('closeModal');
        }
    }
});
