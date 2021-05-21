import Helper from '@ember/component/helper';
import {getSymbol} from 'ember-quickstart/utils/currency';
import {inject as service} from '@ember/service';

export default class CurrencySymbolHelper extends Helper {
    @service feature;

    compute([currency]) {
        return getSymbol(currency);
    }
}
