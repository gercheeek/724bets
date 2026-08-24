<template>
<div class="container">

    <div class="row hidden">
        <h4>Test Cases</h4>
        <span>Success: 21</span>
        <span>Failed: 43</span>
    </div>

    <div class="row" style="margin: 10px 0px;">
        <form @submit.prevent="runTestGet(appData)" method="post">
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">Callback Url</label>
                    <input required v-model="appData.callback_url" class="form-control" id="AgentUrl" name="AgentUrl" placeholder="CALLBACK URL" type="text" />
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">APP KEY</label>
                    <input required v-model="appData.app_key" class="form-control" id="AgentCode" name="AgentCode" placeholder="APP KEY" type="text" />
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">APP ID</label>
                    <input required v-model="appData.app_id" class="form-control" id="AgentCode" name="AgentCode" placeholder="APP ID" type="text" />
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">CURRENCY</label>
                    <select required v-model="appData.currency" class="form-control" id="exampleFormControlSelect1">
                        <option>TRY</option>
                        <option>EUR</option>
                        <option>USD</option>
                        <option>CHF</option>
                        <option>BAM</option>
                        <option>AUD</option>
                        <option>CAD</option>
                    </select>

                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">GAME ID</label>
                    <input required v-model="appData.game_id" class="form-control" id="SecretKey" name="SecretKey" placeholder="GAME ID" type="text" />
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">PLAYER ID</label>
                    <input required v-model="appData.player_id" class="form-control" id="SecretKey" name="SecretKey" placeholder="PLAYER ID" type="text" />
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">SHOP ID</label>
                    <input required v-model="appData.shop_id" class="form-control" id="SHOPID" name="SHOPID" placeholder="SHOP ID" type="text" />
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">PLAYER TOKEN</label>
                    <input required v-model="appData.player_token" class="form-control" id="MemberName" name="MemberName" placeholder="PLAYER TOKEN" type="text" />
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">EXIT URL</label>
                    <input required v-model="appData.exit" class="form-control" id="MemberName" name="MemberName" placeholder="EXIT URL" type="text" />
                </div>
            </div>

            <div class="col-md-1">
                <button :disabled="pendingResponse" type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
    <div class="row" style="margin: 10px 0px;">

        <table class="table table-bordered">
            <thead>
                    <tr v-if="_.has(tests, 'API DATA')">
                        <td colspan="5" style="max-width: 100px; word-wrap: break-word; ">
                           
                           <strong>Test Query</strong>
                        </td>
                    </tr>
                    <tr v-if="_.has(tests, 'API DATA')">
                        <td colspan="5" style="max-width: 100px; word-wrap: break-word; ">
                          <a :href="((this.origin) + '/' + _.get(tests, 'API DATA.test_case_params'))"> {{((this.origin) + '/' + _.get(tests, 'API DATA.test_case_params'))}} </a>
                        </td>
                    </tr>
                <tr>
                    <th style="max-width: 100px" scope="col">ApiUrl</th>
                    <th style="max-width: 200px" scope="col">Request</th>
                    <th style="max-width: 200px" scope="col">Response</th>
                    <th style="max-width: 150px" scope="col">Message</th>
                    <th style="max-width: 100px" scope="col">Pass</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(vals, title) in tests">
                    <tr>
                        <td colspan="5" style="max-width: 100px; word-wrap: break-word; ">
                            <strong>{{title}}</strong>
                            <button @click="runTest(vals, title)" class="btn btn-primary btn-sm hidden" style="float:right;">
                                run
                            </button>
                        </td>
                    </tr>
                    <tr v-for="(tests1, index) in [vals]">
                        <td style="max-width: 100px; word-wrap: break-word; ">{{title}}</td>
                        <td style="max-width: 200px; word-wrap: break-word; ">
                            <pre>{{tests1.request || tests1}}</pre>
                        </td>
                        <td style="max-width: 200px; word-wrap: break-word; ">
                            <pre>{{tests1.response}}</pre>
                        </td>
                        <td style="max-width: 150px; word-wrap: break-word; ">{{tests1.message}}</td>
                        <td style="max-width: 100px; word-wrap: break-word; ">{{tests1.pass}}</td>
                    </tr>
                </template>
            </tbody>
        </table>

    </div>

</div>
</template>

<script>
module.exports = {
    data: () => {
        return {
            origin: location.origin,
            pendingResponse: false,
            appData: {
                app_key: null,
                app_id: null,
                exit: null,
                player_token: null,
                callback_url: null,
                currency: null,
                game_id: null,
                shop_id: '1',
                player_id: null,
            },
            tests: {},
        }
    },
    created() {
        // this.gettestcases()
        // this.runTestGet(this.appData)
        if (!window.location.search && localStorage.getItem('lasttest')) {
            this.appData = JSON.parse(localStorage.getItem('lasttest'))
        } else if(window.location.search){
            const urlParams = new URLSearchParams(window.location.search);
            let queryData = Object.fromEntries(urlParams)
            if (queryData.app_key) {
                this.appData = queryData
            }


        }

    },
    methods: {
        gettestcases() {
            fetch('scenes/scenerio_mgc_test_site.json').then((res) => {
                return res.json()
            }).then((res) => {
                console.log(res);
                this.tests = _.mapValues(res, (x) => {
                    return x.map((xs) => {
                        try {
                            xs.response = JSON.parse(xs.response)

                        } catch (error) {

                        }
                        return xs
                    })
                })
            })
        },
        urlParams(query = {}) {
            const params = new URLSearchParams(query);
            return '?' + params.toString().replaceAll('undefined', '');
        },
        async runTestGet(details) {
            localStorage.setItem('lasttest', JSON.stringify(details))
            this.pendingResponse = true
            let preCommand = {
                "cache": "no-cache",
                "follow": 20,
                "headers": {
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                "insecureHTTPParser": true,
                "method": "POST",
                "redirect": "follow",
                "referrerPolicy": "no-referrer"

            }

            preCommand.body = JSON.stringify(details)
            //return await fetch('/test-run' + this.urlParams(details), preCommand).then((res) => {
              //  console.log(['this.urlParams(details)', this.urlParams(details)])
            return await fetch('/test-run', preCommand).then((res) => {
                return res.json()
            }).then((data) => {
                console.log(data);
                this.pendingResponse = false
                this.tests = data
            }).catch((error) => {
                this.pendingResponse = false
                alert(error.message)
            })

        },
        async runTest(vals, title) {
            console.log(this.tests[title]);
            let preCommand = {
                "body": "",
                "cache": "no-cache",
                "follow": 20,
                "headers": {
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                "insecureHTTPParser": true,
                "method": "POST",
                "redirect": "follow",
                "referrerPolicy": "no-referrer"

            }

            vals.map(async (xsx, indis) => {
                setTimeout(async () => {

                    console.log(xsx, indis, title);

                    let copyPreCommand = _.clone(preCommand)
                    copyPreCommand.body = JSON.stringify(xsx.request)

                    return await fetch('/test-run'
                        .replace('https://mgcg.matgaming.io', 'http://127.0.0.1:4301'), copyPreCommand).then((res) => {
                        //console.log(res.headers.raw());
                        return res.json()
                    }).then((data) => {
                        delete data.test
                        //console.log({xv, data, body: xsx});
                        this.tests[title][indis].response = data
                        return data
                    })
                }, indis * 2000);

            });
            /* vals.forEach((async (xsx, indis) => {
                 let copyPreCommand = _.clone(preCommand)
                 copyPreCommand = JSON.stringify(xsx.request)
                     console.log(copyPreCommand);
                 fetch(xsx.url.replace('https://mgcg.matgaming.io', 'http://127.0.0.1:4301'), copyPreCommand).then((res) => {
                     console.log(res.headers.raw());
                     return res.json()
                 }).then((data) => {
                     //console.log({xv, data, body: xsx});
                     this.tests[title][indis] = data
                     return data
                 })
             })*/

        },
    }
}
</script>

<style>
.container {
    width: 100% !important;
}
</style>
