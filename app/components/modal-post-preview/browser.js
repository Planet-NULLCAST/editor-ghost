import Component from '@glimmer/component';
import copyTextToClipboard from 'ember-quickstart/utils/copy-text-to-clipboard';
import {task} from 'ember-concurrency-decorators';
import {timeout} from 'ember-concurrency';

export default class ModalPostPreviewBrowserComponent extends Component {
    @task
    *copyPreviewUrl() {
        copyTextToClipboard(this.args.post.previewUrl);
        yield timeout(this.isTesting ? 50 : 3000);
    }
}
