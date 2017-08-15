<template>
  <div class="macroButton">
    <Button v-if="!$slots.default"
      v-bind="$attrs"
      :type="type"
      @click="$emit('click', macro)"
    >
      <slot name="icon"></slot>{{ $slots.icon && '&nbsp;&nbsp;' }}{{ label }}
    </Button>
    <Poptip v-else :placement="poptip.position" :width="poptip.width">
      <Button :type="type" v-bind="$attrs">
        <slot name="icon"></slot>{{ $slots.icon && '&nbsp;&nbsp;' }}{{ label }}
      </Button>
      <Row slot="content">
        <Col span="24">
          <slot></slot>
        </Col>
      </Row>
    </Poptip>
  </div>
</template>

<script>
  export default {
    props: {
      macro: String,
      label: String,
      type: {
        type: String,
        default: 'ghost'
      },
      poptip: {
        type: Object,
        default: () => {
          return {
            position: 'bottom',
            width: '400'
          }
        }
      }
    }
  }
</script>
