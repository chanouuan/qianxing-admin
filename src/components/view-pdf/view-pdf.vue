<template>
  <Modal :value="model_value" :footer-hide="true" fullscreen @on-visible-change="modalChange">
    <p slot="header">
      文件预览
    </p>
    <iframe :src="src" frameborder="0" style="width: 100%; height: 100%"></iframe>
  </Modal>
</template>

<script>
export default {
  name: 'viewpdf',
  model: {
    prop: 'model_value',
    event: 'child-change'
  },
  props: {
    model_value: Boolean,
    src: String
  },
  methods: {
    modalChange (val) {
      // 关闭
      this.$emit('child-change', val)
    }
  }
}
</script>

<style lang="less">
.ivu-modal-body {
  padding: 5px 0;
  overflow: hidden;
}
</style>
