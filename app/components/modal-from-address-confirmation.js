import ModalComponent from 'ember-quickstart/components/modal-base';
import {alias} from '@ember/object/computed';

export default ModalComponent.extend({

    confirm() {},
    fromAddress: alias('model.fromAddress')
});
