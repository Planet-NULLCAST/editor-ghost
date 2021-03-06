import Component from '@ember/component';
import copyTextToClipboard from 'ember-quickstart/utils/copy-text-to-clipboard';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import {task, timeout} from 'ember-concurrency';

export default Component.extend({
    config: service(),
    store: service(),
    settings: service(),
    tagName: '',
    isLink: true,
    prices: null,
    copiedPrice: null,

    filteredPrices: computed('prices', 'settings.portalPlans.[]', function () {
        const portalPlans = this.get('settings.portalPlans');
        const prices = this.prices || [];
        return prices.filter((d) => {
            return d.amount !== 0 && d.type === 'recurring';
        }).map((price) => {
            return {
                ...price,
                checked: !!portalPlans.find(d => d === price.id)
            };
        });
    }),

    toggleValue: computed('isLink', function () {
        return this.isLink ? 'Data attributes' : 'Links';
    }),

    sectionHeaderLabel: computed('isLink', function () {
        return this.isLink ? 'Link' : 'Data attribute';
    }),

    init() {
        this._super(...arguments);
        this.siteUrl = this.config.get('blogUrl');
        this.getAvailablePrices.perform();
    },

    actions: {
        toggleShowLinks() {
            this.toggleProperty('isLink');
        }
    },
    copyStaticLink: task(function* (id) {
        this.set('copiedPrice', id);
        let data = '';
        if (this.isLink) {
            data = id ? `#/portal/${id}` : `#/portal/`;
        } else {
            data = id ? `data-portal="${id}"` : `data-portal`;
        }
        copyTextToClipboard(data);
        yield timeout(this.isTesting ? 50 : 3000);
    }),
    copySignupLink: task(function* (price) {
        this.set('copiedPrice', price.id);
        let data = '';
        if (this.isLink) {
            data = `#/portal/signup/${price.id}`;
        } else {
            data = `data-portal="signup/${price.id}"`;
        }
        copyTextToClipboard(data);
        yield timeout(this.isTesting ? 50 : 3000);
    }),
    getAvailablePrices: task(function* () {
        const products = yield this.store.query('product', {include: 'stripe_prices'});
        const product = products.firstObject;
        const prices = product.get('stripePrices');
        const activePrices = prices.filter((d) => {
            return !!d.active;
        });
        this.set('prices', activePrices);
    }).drop()
});
