<!DOCTYPE html>
<html>
  <!--
    WARNING! Make sure that you match all Quasar related
    tags to the same version! (Below it's "@1.15.10")
  -->
  <head>
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/animate.css@^4.0.0/animate.min.css" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/quasar@1.15.10/dist/quasar.min.css" rel="stylesheet" type="text/css">
    <style>
      body {
        background: #e0e0e0;
      }
    .qpage {padding-right: 280px !important; /* hide scroll bar on the right */}
    </style>

  </head>

  <body>

    <div id="q-app">
      <div class="">
        <q-layout view="hHh Lpr lff" container style="height: 100vh;" class="shadow-2 rounded-borders">
          <q-header elevated class="bg-black hidden">
            <q-toolbar class="bg-grey-7 " style="min-height: 40px;">
              <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="arrow_back_ios_new" class="q-mr-sm"></q-btn>
              <q-separator dark vertical inset></q-separator>

              <q-space></q-space>
              <q-avatar class="fixed-top-center" style="width: 40px;height: 40px;position: fixed;left: 50%;top: 0px;transform: translate(-50%);">
                <img src="/images/IDE21_LOGO3.svg">
              </q-avatar>

              <q-btn flat @click="goFullscreen" round dense icon="fullscreen" class="q-mr-sm"></q-btn>
              <q-separator dark vertical inset></q-separator>
              <!-- WORKSPACE -->
              <q-btn-dropdown stretch flat label="WORKSPACE">
                <q-list>
                  <q-item v-for="n in 1" :key="`x.${n}`" clickable v-close-popup tabindex="0">
                    <q-item-section avatar>
                      <q-avatar icon="folder" color="secondary" text-color="white"></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Design</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="info"></q-icon>
                    </q-item-section>
                  </q-item>
                  <q-separator inset spaced></q-separator>
                  <q-item v-for="n in 1" :key="`x.${n}`" clickable v-close-popup tabindex="0">
                    <q-item-section avatar>
                      <q-avatar icon="folder" color="secondary" text-color="white"></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>CMS</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="info"></q-icon>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <!-- ENGINE - in this phase - disabled --><!--
              <q-btn-dropdown stretch flat label="Frontend Engine">
                <q-list>
                  <q-item v-for="n in 1" :key="`x.${n}`" clickable v-close-popup tabindex="0">
                    <q-item-section avatar>
                      <q-avatar icon="folder" color="secondary" text-color="white"></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Vue.js</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="info"></q-icon>
                    </q-item-section>
                  </q-item>
                  <q-separator inset spaced></q-separator>
                  <q-item v-for="n in 1" :key="`y.${n}`" clickable v-close-popup tabindex="0">
                    <q-item-section avatar>
                      <q-avatar icon="assignment" color="primary" text-color="white"></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>React</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="info"></q-icon>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>-->

              <q-separator dark vertical></q-separator>
              <q-btn @click="() => emitMessageReqID('logout_a')" stretch flat label="LOGOUT"></q-btn>
              <q-separator dark vertical></q-separator>
              <q-btn flat round dense @click="drawerRight = !drawerRight" icon="arrow_forward_ios" class="q-ml-sm"></q-btn>
            </q-toolbar>
          </q-header >

          <q-page-container class="qpage">
            <q-page >
              <iframe id="creator" src="/adm" title="Tools and properties" style="width: 100%;height: 100%; position: absolute; top: 0; left: 0; border: 0;"></iframe> 
            </q-page>
          </q-page-container>

          <q-drawer
          v-model="drawerLeft"
          show-if-above
          :width="300"
          :breakpoint="700"
          bordered
          content-class="bg-grey-3"
          class="q-drawer hidden"
          >
          <q-scroll-area class="fit">
            <div class="">
              <!--<div v-for="n in 50" :key="n">Drawer</div>-->
            </div>

            <div class="">
              <div class="q-gutter-y-md" style="max-width: 600px">
                <q-card style="background: transparent; box-shadow: none;">
                  <q-tabs
                  v-model="tab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                  >
                  <q-tab name="layers" label="Layers"></q-tab>
                  <q-tab name="components" label="Components"></q-tab>
                  <q-tab name="options" label="Options"></q-tab>
                  
                </q-tabs>

                <q-separator></q-separator>

                <q-tab-panels v-model="tab" animated style="background: transparent;">
                  <q-tab-panel name="layers">
                    <div class="text-h6">Layers</div>
                    Here should come objects from the old panel
                  </q-tab-panel>

                  <q-tab-panel name="components">
                    <div class="text-h6">Components</div>
                    Here should come available components to be draged and dropped on the canvas
                  </q-tab-panel>
                  
                  <q-tab-panel name="options">
                    <div class="text-h6">Options</div>
                    Here should come options from the old panel, apply to all languages, theme
                  </q-tab-panel>

                </q-tab-panels>
              </q-card>

            </div>
          </div>


        </q-scroll-area>
      </q-drawer>
      <q-drawer
      side="right"
      v-model="drawerRight"
      show-if-above
      bordered
      :width="300"
      :breakpoint="500"
      content-class="bg-grey-3"
      >
      <q-scroll-area class="fit">
        <div class="q-pa-sm">
          <!--<div v-for="n in 50" :key="n">Drawer / 50</div>-->
        </div>
      </q-scroll-area>
    </q-drawer>

    </q-layout>

    </div>
  </div>

  <!-- Add the following at the end of your body tag -->

  <script src="https://cdn.jsdelivr.net/npm/vue@^2.0.0/dist/vue.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/quasar@1.15.10/dist/quasar.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/quasar@1.15.10/dist/icon-set/material-icons-round.umd.min.js"></script>
  <script type="text/javascript" src="/JS/jquery/jquery-3.6.0.min.js"></script>

  <script>
      //Quasar.iconSet.set(Quasar.iconSet.materialIconsRound)

      new Vue({
        el: '#q-app',
        data () {
          return {
            drawerLeft: false,
            drawerRight: false,
            tab: 'layers',
            goFullscreen : function() {

                var qAppFS = document.getElementById("q-app");

                function openFullscreen() {

                  // Requesting fullscreen mode:
                  Quasar.AppFullscreen.request()
                    .then(() => { 
                      // success!
                    })
                    .catch(err => { 
                      // oh, no!!!
                    });

                if (qAppFS.requestFullscreen) {
                    qAppFS.requestFullscreen();
                  } else if (qAppFS.webkitRequestFullscreen) { /* Safari */
                    qAppFS.webkitRequestFullscreen();
                  } else if (qAppFS.msRequestFullscreen) { /* IE11 */
                    qAppFS.msRequestFullscreen();
                  }
                }

                if((window.fullScreen) ||
                   (window.innerWidth == screen.width && window.innerHeight == screen.height)) {

                    document.exitFullscreen();

                 } else {

                    openFullscreen(); 
                }
            },
            toggleDrawerLeft: function(drawerLeft) {
                //drawerLeft = !drawerLeft
            },
            // function that is important for integration with the old admin; when the link in the new admin is clicked, the old admins link should receive the event
            emitMessageReqID: function(elid) {
              //console.log('should click: ' + elid);
              document.getElementById('creator').contentWindow.postMessage(elid, '*');
              if(elid == 'logout_a') {
                $('.q-header').addClass('hidden');
                $('.q-drawer').addClass('hidden');
              }
            }

          }
        }
      });


      window.addEventListener('message', function(message){
        //console.log(message.data);
        // if logged in to creator admin, show the new admin  
        $('.q-header').removeClass('hidden');
        $('.q-drawer').removeClass('hidden');
      });

    </script>
    <script>
      // optional
      window.quasarConfig = {
        brand: { // this will NOT work on IE 11
          //primary: '#e46262',
          // ... or all other brand colors
        },
        framework: 'all',
        notify: {

        }, // default set of options for Notify Quasar plugin
        loading: {

        }, // default set of options for Loading Quasar plugin
        loadingBar: {

        }, // settings for LoadingBar Quasar plugin
        // ..and many more
      }
    </script>
  </body>
  </html>