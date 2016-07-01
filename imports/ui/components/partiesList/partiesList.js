import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { name as PartyAdd } from '../partyAdd/partyAdd';
import { name as PartyRemove } from '../partyRemove/partyRemove';
import { name as PartiesSort } from '../partiesSort/partiesSort';
import { name as PartyCreator } from '../partyCreator/partyCreator';
import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
import { name as PartyRsvpsList } from '../partyRsvpsList/partyRsvpsList';
import { name as PartyUnanswered } from '../partyUnanswered/partyUnanswered';
import { Parties } from '../../../api/parties/index';
import template from './partiesList.html';
import utilsPagination from 'angular-utils-pagination';

class PartiesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('users');

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1,
    };
    this.searchText = '';

    this.subscribe('parties', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort'),
    }, this.getReactively('searchText'),
    ]);

    this.helpers({
      parties() {
        return Parties.find({}, {
          sort: this.getReactively('sort'),
        });
      },

      partiesCount() {
        return Counts.get('numberOfParties');
      },
    });
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'partiesList';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  PartiesSort,
  PartyAdd,
  PartyRemove,
  PartyCreator,
  PartyRsvp,
  PartyRsvpsList,
  PartyUnanswered,
]).component(name, {
  template,
  controllerAs: name,
  controller: PartiesList,
})
.config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('parties', {
      url: '/parties',
      template: '<parties-list></parties-list>',
    });

}
