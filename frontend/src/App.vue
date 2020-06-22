<template>
  <div id="app">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Zooted Word Game
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Home
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/create' }">
          Create Game
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/lobby' }">
          View Lobbies
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>
