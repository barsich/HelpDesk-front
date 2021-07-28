import HelpDesk from './HelpDesk';
import HelpDeskMarkups from './HelpDeskMarkups';
import Modals from './Modals';

const container = document.querySelector('.container');
const hp = new HelpDesk(new HelpDeskMarkups(container, new Modals()));

hp.init();
