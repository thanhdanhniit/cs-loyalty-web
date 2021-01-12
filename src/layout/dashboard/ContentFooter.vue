<template>
  <footer class="footer">
    <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" target="_blank" rel="noopener" href="http://www.2cherryshop.com">
            2Cherryshop
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            2Cherryshop Loyalty
          </a>
        </li>
      </ul>
      <div class="copyright">
        © {{year}} made with <i class="tim-icons icon-heart-2"></i> by
        <a href="#">Michael Nguyen</a>.
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    data() {
      return {
        year: new Date().getFullYear()
      }
    }
  };
</script>
<style>
</style>
