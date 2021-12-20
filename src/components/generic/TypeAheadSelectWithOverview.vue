<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TypeAheadSelectWithOverview',
    props: {
        items: {
            type: [Array, null, Object],
            required: true,
        },
        itemKey: {
            type: String,
            required: true,
        },
        itemValue: {
            type: String,
            required: true,
        },
        itemLabel: {
            type: String,
            required: true,
        },
        searchLabel: {
            type: String,
        },
        searchPlaceholder: {
            type: String,
            required: true,
        },
        searchProperties: {
            type: Array,
            required: true,
        },
        onRetry: {
            type: Function,
            required: false,
        }
    },
    emits: [
        'select',
    ],
    data() {
        return {
            searchInput: '',
            isInputFocused: false,
            currentSelectionIndex: 0,
        };
    },
    methods: {
        onInput() {
            if (!this.isInputFocused) {
                return
            }
            if (this.currentSelectionIndex < this.filteredItems.length) {
                return
            }

            this.currentSelectionIndex = (this.filteredItems.length || 1) - 1;
        },
        onFocus() {
            this.isInputFocused = true;
        },
        onBlur() {
            this.isInputFocused = false;
        },
        onArrowDown($event) {
            if (!this.isInputFocused) {
                return
            }
            if (this.currentSelectionIndex >= this.filteredItems.length - 1) {
                return
            }
            this.currentSelectionIndex++;
        },
        onArrowUp($event) {
            if (!this.isInputFocused) {
                return
            }
            if (this.currentSelectionIndex === 0) {
                return
            }
            this.currentSelectionIndex--;
        },
        onEscape() {
            this.searchInput = ''
            this.blurInput()
            this.currentSelectionIndex = -1;
        },
        selectCurrentSelection() {
            if (!this.currentSelection) {
                return
            }
            this.selectItem(this.currentSelection);
        },
        selectItem(item) {
            this.searchInput = item[this.itemLabel];
            this.currentSelectionIndex = 0;
            this.$emit('select', item);
            this.blurInput()
        },
        blurInput() {
            this.$refs.searchInputField.$el.blur();
        },
        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },
        highlightMatchText(text) {
            const regexp = new RegExp(`(${this.escapeRegExp(this.searchInput)})`, 'ig');
            return text.replace(regexp, '<strong>$1</strong>');
        },
        clearInput() {
            this.searchInput = ''
        },
        hover(item, index) {
            this.currentSelectionIndex = index
        }
    },
    computed: {
        filteredItems() {
            if (Array.isArray(this.items) === false) {
                return null
            }
            const regexp = new RegExp(this.escapeRegExp(this.searchInput), 'i');
            return this.items.filter((item) => this.searchProperties.some(searchProperty => item[searchProperty].match(regexp)));
        },
        isListVisible() {
            return this.isInputFocused && this.filteredItems.length;
        },
        currentSelection() {
            return this.isInputFocused && this.currentSelectionIndex < this.filteredItems.length ? this.filteredItems[this.currentSelectionIndex] : undefined;
        },
    },
})

</script>

<template>
    <div role="group" class="type-ahead__search">
        <label class="type-ahead__search-label">
            <slot name="label"></slot>
        </label>
        <b-form-input
            class="type-ahead__search-input"
            v-model="searchInput"
            ref="searchInputField"
            :placeholder="searchPlaceholder"
            trim
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keydown.down.prevent="onArrowDown"
            @keydown.up.prevent="onArrowUp"
            @keydown.enter.tab.prevent="selectCurrentSelection"
            @keydown.escape.prevent="onEscape"
            autocomplete="off"
        ></b-form-input>
        <a href="#" @click.prevent="clearInput()" class="type-ahead__search-clear">&times;</a>
    </div>
    <b-list-group>
        <template v-if="items === null">
            <b-list-group-item>
                <slot name="loading">Loading...</slot>
            </b-list-group-item>
        </template>
        <b-list-group-item
            v-for="(item, index) in filteredItems"
            :key="item[itemKey]"
            :value="item[itemValue]"
            class="type-ahead-list__item"
            :active="currentSelectionIndex === index"
            :class="{ 'type-ahead-list__item--is-active': currentSelectionIndex == index }"
            @click="selectItem(item)"
            v-html="highlightMatchText(item[itemLabel])"
            @mouseenter="hover(item, index)"
        ></b-list-group-item>
    </b-list-group>
</template>

<style lang="scss" scoped>
.type-ahead {
    &__search {
        position: sticky;
        top: 0;
        z-index: 100;
        background-image: linear-gradient(
            0deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 1) 6%,
            rgba(255, 255, 255, 1) 100%
        );

        padding-top: 1rem;
        padding-bottom: 1rem;
        display: flex;
        flex-wrap: wrap;
    }
    &__search-label {
        flex: 1 0 100%;
    }
    &__search-input {
        flex: 1 0 calc(100% - 50px);
    }
    &__search-clear {
        color: currentColor;
        text-decoration: none;
        vertical-align: middle;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    &__item {
        &--is-active {
            font-weight: 500;
        }
    }
}
</style>