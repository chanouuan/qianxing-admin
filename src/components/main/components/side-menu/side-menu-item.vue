<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <common-icon :size="iconSize" :type="parentItem.icon || ''"/>
      <span>{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :style="{lineHeight:iconSize+'px',paddingTop:'10px',paddingBottom:'10px',fontSize:'16px'}" :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`"><common-icon :size="iconSize" :type="item.children[0].icon || ''"/><span>{{ showTitle(item.children[0]) }}</span></menu-item>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :style="{lineHeight:iconSize+'px',paddingTop:'10px',paddingBottom:'10px',fontSize:'16px'}" :name="getNameOrHref(item)" :key="`menu-${item.name}`"><common-icon :size="iconSize" :type="item.icon || ''"/><span>{{ showTitle(item) }}</span></menu-item>
      </template>
    </template>
  </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [ mixin, itemMixin ],
  props: {
    iconSize: {
      type: Number,
      default: 24
    }
  }
}
</script>

<style lang="less">
.ivu-menu-submenu-title{
  line-height: 24px;
  padding: 10px 16px !important;
  font-size: 16px;
}
.ivu-menu-submenu-title-icon{
  right: 8px !important;
}
</style>
