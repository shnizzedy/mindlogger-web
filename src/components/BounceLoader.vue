<template>
  <section class="wrapper">
    <div class="ccard">
      <div class="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  @import '../custom-bootstrap.scss';

.wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: 100vh;
  min-width: 100vw; */
  /* background-color: #c89b7e; */
}
.ccard {
  display: flex;
  padding: 24px;
  /* border-radius: 5px;
  box-shadow: 1px 4px 16px rgba(0,0,0,.4); */
  min-height: 300px;
  min-width: 400px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader{
   border-radius: 50%;
  position: relative;
  margin: 50px;
  display: inline-block;
  height: 0px;
  width: 0px;
}

.loader span{
    position: absolute;
    display: block;
    background: #fff;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    top: -20px;
    perspective: 100000px;
}
.loader span:nth-child(1) {
    left:60px;
    animation: bounce2 1s cubic-bezier(0.04, 0.35, 0, 1) infinite;
    animation-delay: 0s;
    background: $red;
}
.loader span:nth-child(2) {
    left:20px;
    animation: bounce2 1s cubic-bezier(0.04, 0.35, 0, 1) infinite;
    animation-delay: .2s;
    background: $yellow;
}
.loader span:nth-child(3) {
    left:-20px;
    animation: bounce2 1s cubic-bezier(0.04, 0.35, 0, 1) infinite;
    animation-delay: .4s;
    background: $green;
}
.loader span:nth-child(4) {
    left: -60px;
    animation: bounce2 1s cubic-bezier(0.04, 0.35, 0, 1) infinite;
    animation-delay: .6s;
    background: $dark-blue;
}

@keyframes bounce2 {
    0%, 75%, 100% {
        transform: translateY(0px);
    }
    25% {
        transform: translateY(-30px);
    }
}
</style>
