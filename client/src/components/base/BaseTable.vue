<template>
    <div>
        <Table :columns="columns"
               :data="tableData"
               :height="tableHeight"
               @on-row-click="onRowClick"
               ref="table"
               highlight-row
               stripe></Table>
        <div class="button-margin">
            <Page :total="total"
                  :page-size="pageSize"
                  show-total
                  show-elevator
                  @on-change="changePage"
                  style="float: right"></Page>
            <Button type="primary" size="large" @click="exportData()">
                <Icon type="ios-download-outline"></Icon>
                <span>数据导出</span>
            </Button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BaseTable",
        props: {
            columns: Array,
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            pageSize: {
                type: Number,
                default: 10
            }
        },
        data() {
            return {
                current: 1
            }
        },
        methods: {
            onRowClick(row, index) {
                this.$emit('on-row-click', row, index);
            },
            changePage(index) {
                this.current = index;
            },
            checkHeight() {
                return Math.min(Math.max(this.total, 5), 10) * 48 + 40;
            },
            // 问题列表导出
            exportData() {
                this.$refs.table.exportCsv({
                    filename: 'list.csv'
                });
            }
        },
        computed: {
            tableHeight() {
                return this.checkHeight();
            },
            tableData() {
                return this.data.slice(this.current * 10 - 10, Math.min(this.current * 10, this.data.length));
            },
            total() {
                return this.data.length;
            },
        }
    }
</script>

<style scoped>
    .button-margin {
        margin: 16px 0;
    }
</style>
