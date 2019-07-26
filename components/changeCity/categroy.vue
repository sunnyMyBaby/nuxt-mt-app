<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">
        {{ item.title }}
      </dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from 'js-pinyin'
export default {
  data() {
    return {
      list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      block: []
    }
  },
  async mounted() {
    const self = this
    const blocks = []
    const { status, data: { city } } = await self.$axios.get('/geo/city')
    if (status === 200) {
      let p
      let c
      const d = {}
      city.forEach((item) => {
        //  getFullChars 获取拼音的全拼
        p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0, 1)
        c = p.charCodeAt(0) // 'a'.charCodeAt(0)方法可返回指定位置的字符的 Unicode 编码a-97,b-98,z-122
        if (c > 96 && c < 123) {
          if (!d[p]) {
            d[p] = []
          }
          d[p].push(item.name)
        }
      })
      // const obj = { foo: 'bar', baz: 'abc' };
      // console.log(Object.entries(obj));  // [['foo', 'bar'], ['baz', 'abc']]

      // const arr = [1, 2, 3];
      // console.log(Object.entries(arr));  // [['0', 1], ['1', '2'], ['2', '3']]

      // const arr2 = [{ a: 1 }, { b: 2 }, { c: 3 }];
      // console.log(Object.entries(arr2));  // [['0', { a: 1 }], ['1', { b: 2 }], ['2', { c: 3 }]]

      // const str = '123';
      // console.log(Object.entries(str));  // [['0', '1'], ['1', '2'], ['2', '3']]
      for (const [k, v] of Object.entries(d)) {
        blocks.push({
          title: k.toUpperCase(),
          city: v
        })
      }
      blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      self.block = blocks
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/categroy.scss";
</style>
