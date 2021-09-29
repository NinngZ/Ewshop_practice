<template>
  <div class="address-edit-box">
    <NavBar>
      <template v-slot:default>
        {{ title }}
      </template>
    </NavBar>
    <van-address-edit
        class="edit"
        :area-list="areaList"
        :address-info="addressInfo"
        :show-delete="type == 'edit'"
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"

    />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue';
import {reactive,onMounted,toRefs,computed} from "vue";
import {Toast} from "vant";
import {useRoute,useRouter} from "vue-router";
import {addAddress,deleteAddress,getAddressDetail,editAddress} from "network/address";
import {tdist} from "../../utils/address.js";

export default {
  name: "AddressEdit",
  setup(){
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      areaList:{
        province_list:{},
        city_list:{},
        county_list:{}
      },
      searchResult:[],
      addressInfo:{},
      type:'add',
      addressId:'',
      title:''
    })
    onMounted(()=>{
      //获取省 市 区 列表构造出来
      let _province_list = {};
      let _city_list = {};
      let _country_list = {};
      //console.log(tdist.getLev1());
      tdist.getLev1().forEach(p=>{
        _province_list[p.id] = p.text;
        //console.log(p.id);
        //console.log(tdist.getLev2(p.id));
        tdist.getLev2(p.id).forEach(c=>{
          _city_list[c.id] = c.text;
          //console.log(tdist.getLev3(c.id));
          tdist.getLev3(c.id).forEach(ct=>{
            _country_list[ct.id] = ct.text;
            //console.log(_country_list);
          })
        })
      })
      state.areaList.province_list = _province_list;
      state.areaList.city_list= _city_list;
      state.areaList.county_list = _country_list;
      //接收参数
      const {type,addressId} = route.query;
      state.type = type;
      state.addressId = addressId;

      //根据type判断是否从数据库获取数据
      if (type == 'edit'){
        getAddressDetail(addressId).then(res=>{
          const addressDetail = res;
          //console.log(addressDetail);
          let _areaCode = '';
          const province = tdist.getLev1();

          Object.entries(state.areaList.county_list).forEach(([id,text])=>{
            //console.log(Object.entries(state.areaList.county_list));
            //先找出对应的区
            //console.log(addressDetail.county);
            if(text == addressDetail.county){
              //找到区对应的省份
              const provinceIndex = province.findIndex(item => item.id.substr(0,2) == id.substr(0,2))
              //console.log(provinceIndex);
              //找到对应的几个市区
              //console.log(Object.entries(state.areaList.city_list)[0][1]);
              const cityItem = Object.entries(state.areaList.city_list).filter(([cityId,city]) => cityId.substr(0,4) == id.substr(0,4))
              //console.log(cityItem);
              //console.log(cityItem[0]);
              //console.log(id);
              //对比找到的省份和接口返回的省份是否相等，因为有些区会重名
              if (province[provinceIndex].text == addressDetail.province && cityItem[0][1] == addressDetail.city){

                _areaCode = id
              }
            }

          })
          console.log(_areaCode);
          state.addressInfo = {
            name:addressDetail.name,
            tel:addressDetail.phone,
            province:addressDetail.province,
            city:addressDetail.city,
            county:addressDetail.county,
            areaCode:_areaCode,
            addressDetail:addressDetail.address,
            isDefault:!!addressDetail .is_default
          }
        })
      }

    })
    //自定义一个标题 根据type的类型进行判断显示
    const title = computed(()=>{
      return state.type = 'add' ? '新增地址' : '编辑地址' ;
    })
    const onSave = (content) => {
      const params = {
        name:content.name,
        phone:content.tel,
        province:content.province,
        city:content.city,
        county:content.county,
        address:content.addressDetail,
        is_default:content.isDefault ? 1 : 0
      }

      if (state.type == 'edit'){
        //调用修改接口
        editAddress(state.addressId,params);
      }else if(state.type == 'add'){
        //调用接口，添加数据
        addAddress(params);
      }


      Toast.success('保存成功...')
      setTimeout(()=>{
        router.back();
      },1000)
    }
    const onDelete = () => {
      deleteAddress(state.addressId).then(res=>{
        Toast.success('删除成功...')
        setTimeout(()=>{
          router.back();
        },1000)
      })
    }

    return {
      ...toRefs(state),
      onSave,
      onDelete,
      title
    }
  },
  components:{
    NavBar
  }
}
</script>

<style scoped lang="scss">
  .edit{
    .van-field_body{
      textarea{
        height: 26px !important;
      }
    }
  }
  .address-edit-box{
    margin-top: 44px;
    .van-address-edit{

    }
  }
</style>