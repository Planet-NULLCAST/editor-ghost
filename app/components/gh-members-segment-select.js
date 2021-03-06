import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {task} from 'ember-concurrency-decorators';
import {tracked} from '@glimmer/tracking';

export default class GhMembersSegmentSelect extends Component {
    @service store;

    @tracked _options = [];

    get renderInPlace() {
        return this.args.renderInPlace === undefined ? false : this.args.renderInPlace;
    }

    constructor() {
        super(...arguments);
        this.fetchOptionsTask.perform();
    }

    get options() {
        if (this.args.hideOptionsWhenAllSelected) {
            const selectedSegments = this.selectedOptions.mapBy('segment');
            if (selectedSegments.includes('status:free') && selectedSegments.includes('status:-free')) {
                return this._options.filter(option => !option.groupName);
            }
        }

        return this._options;
    }

    get flatOptions() {
        const options = [];

        function getOptions(option) {
            if (option.options) {
                return option.options.forEach(getOptions);
            }

            options.push(option);
        }

        this._options.forEach(getOptions);

        return options;
    }

    get selectedOptions() {
        const segments = (this.args.segment || '').split(',');
        return this.flatOptions.filter(option => segments.includes(option.segment));
    }

    @action
    setSegment(options) {
        const segment = options.mapBy('segment').join(',') || null;
        this.args.onChange?.(segment);
    }

    @task
    *fetchOptionsTask() {
        const options = yield [{
            name: 'Free members',
            segment: 'status:free',
            class: 'segment-status-free'
        }, {
            name: 'Paid members',
            segment: 'status:-free', // paid & comped
            class: 'segment-status-paid'
        }];

        // fetch all labels w̶i̶t̶h̶ c̶o̶u̶n̶t̶s̶
        // TODO: add `include: 'count.members` to query once API is fixed
        const labels = yield this.store.query('label', {limit: 'all'});

        if (labels.length > 0) {
            const labelsGroup = {
                groupName: 'Labels',
                options: []
            };

            labels.forEach((label) => {
                labelsGroup.options.push({
                    name: label.name,
                    segment: `label:${label.slug}`,
                    count: label.count?.members,
                    class: 'segment-label'
                });
            });

            options.push(labelsGroup);
        }

        // fetch all products w̶i̶t̶h̶ c̶o̶u̶n̶t̶s̶
        // TODO: add `include: 'count.members` to query once API supports
        const products = yield this.store.query('product', {limit: 'all'});

        if (products.length > 0) {
            const productsGroup = {
                groupName: 'Products',
                options: []
            };

            products.forEach((product) => {
                productsGroup.options.push({
                    name: product.name,
                    segment: `product:${product.slug}`,
                    count: product.count?.members,
                    class: 'segment-product'
                });
            });

            options.push(productsGroup);
        }

        this._options = options;
    }
}
