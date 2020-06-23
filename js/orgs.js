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

Organization = function(name, repos) {
  this.name = name;
  this.repos = repos || [];
}

// modified by rfuehrer
Organization.prototype.totalRepos = function() {
  total = 0;
  this.repos.forEach(function(repo) {
    total += 1;
  });

  return total;
}

Organization.prototype.totalForks = function() {
  total = 0;
  this.repos.forEach(function(repo) {
    total += repo.forks;
  });

  return total;
}

Organization.prototype.totalWatchers = function() {
  total = 0;
  this.repos.forEach(function(repo) {
    total += repo.watchers;
  });

  return total;
}

Organization.prototype.forkedCount = function() {
  total = 0;
  this.repos.forEach(function(repo) {
    if (repo.fork) {
      total += 1;
    }
  });

  return total;
}

Organization.prototype.notForkedCount = function() {
  total = 0;
  this.repos.forEach(function(repo) {
    if (!repo.fork) {
      total += 1;
    }
  });

  return total;
}

Organization.prototype.featuredRepos = function() {
  featured = [];
  this.repos.forEach(function(repo) {
    if (repo.featured()) {
//    if (repo.featured() && !repo.fork) {
      if (repo.position()) {
        featured[repo.position()-1] = repo
      } else {
        featured.push(repo);
      }
    }
  });

  return featured;
}

Organization.prototype.deprecatedRepos = function() {
  deprecated = [];
  this.repos.forEach(function(repo) {
    if (repo.deprecated() && !repo.fork) {
      deprecated.push(repo);
    }
  });

  return deprecated;
}


Organization.prototype.forkedRepos = function() {
  forked = [];
  this.repos.forEach(function(repo) {
    if (repo.fork) {
      forked.push(repo);
    }
  });

  return forked;
}

Organization.prototype.regularRepos = function() {
  regular = [];
  this.repos.forEach(function(repo) {
    if (!repo.featured() && !repo.deprecated()) {
//    if (!repo.fork && !repo.featured() && !repo.deprecated()) {
      regular.push(repo);
    }
  });

  return regular;
}

Organization.prototype.addReposToContainer = function(container, repos) {
  repos.forEach(function(repo, i) {
    container.append(repo.getContainer(i+1));
  });
}
