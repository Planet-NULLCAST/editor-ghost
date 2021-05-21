import ModalComponent from 'ember-quickstart/components/modal-base';

export default ModalComponent.extend({
    actions: {
        confirm() {
            this.closeModal();
        }
    },

    click() {
        let input = this.element.querySelector('input');
        if (input) {
            input.focus();
        }
    }
});
