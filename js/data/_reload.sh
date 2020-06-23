# Copyright 2019, Yelp, Inc.
# Copyright 2020, Generali Deutschland AG
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#!/bin/bash

cd $(dirname $0)

get_all_pages() {
  local url_prefix="$1"
  local outfile=$(mktemp)
  local response=
  local page_size=100
  local page=1

  while [ "$response" != "[]" ]
  do
    local url="$url_prefix?per_page=$page_size&page=$page"
    echo "$url" >&2

    response=$(curl -sf "$url" | jq . | tee -a "$outfile")

    if [ $? -ne 0 ]
    then
      echo "curl failed, so I'm gonna get out of here." >&2
      echo "[]"
      exit 1
    fi

    # modified by rfuehrer
    if grep -Fxq "API rate limit exceeded" "$outfile"
    then
      echo "API rate limit exceeded. Abort."
      exit 1
    fi

    let page=page+1
  done

  cat "$outfile" | jq '.[]' | jq -s .
}

# Repos

get_repos() {
  # modified by rfuehrer
  get_all_pages 'https://api.github.com/users/generaliinformatik/repos'
}

(echo -n '$(function() { loadRepositoryData(' ; get_repos ; echo '); })') > load_repos.js

# Organization Members (note: only public ones)

get_members() {
  get_all_pages 'https://api.github.com/orgs/generaliinformatik/members'
}

(echo -n '$(function() { loadMemberData(' ; get_members ; echo '); })') > load_members.js
