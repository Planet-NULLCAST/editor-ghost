import ModalComponent from 'ember-quickstart/components/modal-base';
import {alias} from '@ember/object/computed';
import {task} from 'ember-concurrency';

export default ModalComponent.extend({
    // Allowed actions
    confirm: () => {},

    user: alias('model'),

    actions: {
        confirm() {
            this.deleteUser.perform();
        }
    },

    deleteUser: task(function* () {
        try {
            yield this.confirm();
        } finally {
            this.send('closeModal');
        }
    }).drop()
});
