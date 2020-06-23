/*

Copyright 2019, Yelp, Inc.
Copyright 2020, Generali Deutschland AG

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

function getAllPages(urlPrefix, callback, page, results) {
  page = page || 1;
  results = results || [];

  var url = urlPrefix + '?per_page=100&page=' + parseInt(page);

  $.get(url, function(data) {
    if (data.length > 0) {
      data.forEach(function(resultDatum) {
        results.push(resultDatum);
      });
      getAllPages(urlPrefix, callback, page + 1, results);
    }
    else {
      callback(results);
    }
  });
}

function getGithubRepos(callback, page, repos) {
  // modified by rfuehrer
  getAllPages('https://api.github.com/users/generaliinformatik/repos', callback);
}

function getGithubMembers(callback) {
  // modified by rfuehrer
  getAllPages('https://api.github.com/orgs/generaliinformatik/members', callback);
}

function loadRepositoryData(repoData) {
  // modified by rfuehrer
  var org = new Organization('generaliinformatik');
  org.repos = [];

  repoData.forEach(function(repoDatum) {
    org.repos.push(new Repository(repoDatum));
  });

  $('.projects .featured').empty();
  $('.projects .not-featured').empty();

  org.addReposToContainer($('.projects .featured'), org.featuredRepos());
  org.addReposToContainer($('.projects .not-featured'), org.regularRepos());

  // modified by rfuehrer
  $('.project-count').html(org.totalRepos());
}

function loadMemberData(members) {
  $('.dev-count').html(members.length);
}

$(document).ready(function() {
  getGithubRepos(loadRepositoryData);
  getGithubMembers(loadMemberData);
});
