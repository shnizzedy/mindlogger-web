<template>
  <nav class="mobile-bottom-nav">
    <slot></slot>
    <!-- <div class="mobile-bottom-nav__item mobile-bottom-nav__item--active"> -->
      <!-- <div class="mobile-bottom-nav__item-content">
      <i class="material-icons">home</i>
      one
      </div>
    </div>
    <div class="mobile-bottom-nav__item">
      <div class="mobile-bottom-nav__item-content">
      <i class="material-icons">mail</i>
      two
      </div>
    </div>
    <div class="mobile-bottom-nav__item">
    <div class="mobile-bottom-nav__item-content">
    <i class="material-icons">person</i>
    three
    </div>
    </div>

    <div class="mobile-bottom-nav__item">
    <div class="mobile-bottom-nav__item-content">
    <i class="material-icons">phone</i>
    four
    </div>
    </div> -->
  </nav>
</template>

<style>
@media only screen and (min-width: 1025px) {
  .mobile-bottom-nav {
    color: blue;
    display: none !important;
  }
}

.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  will-change: transform;
  -webkit-transform: translateZ(0);
          transform: translateZ(0);
  display: flex;
  height: 75px;
  box-shadow: 0 -2px 5px -2px rgb(134, 134, 134);
  background-color: #fff;
  overflow-x: auto;
}
.mobile-bottom-nav__item {
  flex-grow: 1;
  text-align: center;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.mobile-bottom-nav__item--active {
  color: red;
}
.mobile-bottom-nav__item-content {
  display: flex;
  flex-direction: column;
}
</style>
