import Component from '@ember/component';
import ValidationStateMixin from 'ember-quickstart/mixins/validation-state';
import {computed} from '@ember/object';

/**
 * Handles the CSS necessary to show a specific property state. When passed a
 * DS.Errors object and a property name, if the DS.Errors object has errors for
 * the specified property, it will change the CSS to reflect the error state
 * @param  {DS.Errors} errors   The DS.Errors object
 * @param  {string} property    Name of the property
 */
export default Component.extend(ValidationStateMixin, {
    classNameBindings: ['errorClass'],

    errorClass: computed('property', 'hasError', 'hasValidated.[]', function () {
        let hasValidated = this.hasValidated;
        let property = this.property;

        if (hasValidated && hasValidated.includes(property)) {
            return this.hasError ? 'error' : 'success';
        } else {
            return '';
        }
    })
});
