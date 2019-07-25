<template>
  <section class="m-istyle">
    <dl @mouseover="over">
      <dt>有格调</dt>
      <dd
        :class="{active:kind==='all'}"
        kind="all"
        keyword="景点">
        全部
      </dd>
      <dd
        :class="{active:kind==='part'}"
        kind="part"
        keyword="美食">
        约会聚餐
      </dd>
      <dd
        :class="{active:kind==='spa'}"
        kind="spa"
        keyword="丽人">
        丽人SPA
      </dd>
      <dd
        :class="{active:kind==='movie'}"
        kind="movie"
        keyword="电影">
        电影演出
      </dd>
      <dd
        :class="{active:kind==='travel'}"
        kind="travel"
        keyword="旅游">
        品质出游
      </dd>
    </dl>
    <ul class="ibody">
      <li
        v-for="item in cur"
        :key="item.title">
        <el-card
          :body-style="{ padding: '0px' }"
          shadow="never">
          <img
            :src="item.img"
            class="image">
          <ul class="cbody">
            <li class="title">
              {{ item.title }}
            </li>
            <li class="pos">
              <span>{{ item.pos }}</span>
            </li>
            <li class="price">
              ￥<em>{{ item.price }}</em><span>/起</span>
            </li>
          </ul>
        </el-card>
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  data: () => {
    return {
      kind: 'all',
      list: {
        all: [
          // {
          //   img: 'http://p1.meituan.net/wedding/8d26f93de654d433b17774e60a1fc5bd1028431.jpg@660w_500h_1e_1c',
          //   title: '木北造型（崇文门新世界店）',
          //   pos: '木北造型（崇文门新世界店）',
          //   price: '439'
          // },
          // {
          //   img: 'https://p0.meituan.net/wedding/cf84fcae014285c1e0e933049d5448e1543563.jpg@660w_500h_1e_1c',
          //   title: '靓圈美甲',
          //   pos: '靓圈美甲',
          //   price: '198'
          // },
          // {
          //   img: 'https://img.meituan.net/msmerchant/96a8260ce5e79d6fa448afaf5e0f6daf575800.jpg@380w_214h_1e_1c',
          //   title: '大董（王府井店）',
          //   pos: '“酥不腻"单人餐',
          //   price: '413'
          // },
          // {
          //   img: 'http://p0.meituan.net/merchantpic/fe97aa40e20e2f8b1d75562bc85952f21338887.jpg@660w_500h_1e_1c',
          //   title: '时尚殿堂hair salon（北京王府井店）',
          //   pos: '时尚殿堂hair salon（北京王府井店）',
          //   price: '257'
          // },
          // {
          //   img: 'http://p0.meituan.net/merchantpic/8d40aacd77004b484151c1ee547918d287691.jpg@380w_214h_1e_1c',
          //   title: '天安瑞嘉烤鸭',
          //   pos: '老北京炸酱面商务套餐，建议2人使用',
          //   price: '88'
          // },
          // {
          //   img: 'https://img.meituan.net/msmerchant/81ff3ba5e15155f39ae56761ccfc157d5844372.png@380w_214h_1e_1c',
          //   title: '和寿堂（新世界店）',
          //   pos: '和寿堂（新世界店）',
          //   price: '98'
          // }
        ],
        part: [],
        spa: [],
        movie: [],
        travel: []
      }
    }
  },
  computed: {
    cur: function () {
      return this.list[this.kind]
    }
  },
  async mounted() {
    const self = this
    const { status, data: { count, pois } } = await self.$axios.get('/search/resultsByKeywords', {
      params: {
        keyword: '景点',
        city: self.$store.state.geo.position.city
      }
    })
    if (status === 200 && count > 0) {
      const r = pois.filter(item => item.photos.length).map((item) => {
        return {
          title: item.name,
          pos: item.type.split(';')[0],
          price: item.biz_ext.cost || '暂无',
          img: item.photos[0].url,
          url: '//abc.com'
        }
      })
      self.list[self.kind] = r.slice(0, 9)
    } else {
      self.list[self.kind] = []
    }
  },
  methods: {
    over: async function (e) {
      console.log('xxxxx')
      const dom = e.target
      const tag = dom.tagName.toLowerCase()
      const self = this
      if (tag === 'dd') {
        this.kind = dom.getAttribute('kind')
        const keyword = dom.getAttribute('keyword')
        const { status, data: { count, pois } } = await self.$axios.get('/search/resultsByKeywords', {
          params: {
            keyword,
            city: self.$store.state.geo.position.city
          }
        })
        if (status === 200 && count > 0) {
          const r = pois.filter(item => item.photos.length).map((item) => {
            return {
              title: item.name,
              pos: item.type.split(';')[0],
              price: item.biz_ext.cost || '暂无',
              img: item.photos[0].url,
              url: '//abc.com'
            }
          })
          self.list[self.kind] = r.slice(0, 9)
        } else {
          self.list[self.kind] = []
        }
      }
    }
  }

}
</script>
<style lang="scss">
    @import "@/assets/css/index/artistic.scss";
</style>
